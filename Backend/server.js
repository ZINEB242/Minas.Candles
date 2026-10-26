
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const Order = require("./models/Order");
const User = require("./models/User");
const Post = require("./models/Post");
const Message = require("./models/Message");
const authenticateToken = require("./middleware/auth");
const authorizeAdmin = require("./middleware/authorizeAdmin");
const Notification = require("./models/Notification");
const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: "http://localhost:5173" }));


 // PAGE D'ACCUEIL DU BACKEND
app.get("/", (req, res) => {
  res.send("Minas Candles Backend fonctionne 🕯️");
});

 // RÉCUPÉRER LES PUBLICATIONS VALIDÉES — PARTIE PUBLIQUE
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    console.error("Erreur de récupération des publications :", error);
    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les publications.",
    });
  }
});


 // CRÉER UNE PUBLICATION — CLIENT CONNECTÉ
app.post("/api/posts", authenticateToken, async (req, res) => {
  try {
    const {
      content,
      type,
      image,
      images,
      title,
      product,
      productName,
      productPrice,
    } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le contenu de la publication est obligatoire.",
      });
    }

    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    // Accepter plusieurs photos et conserver la compatibilité
    // avec les anciennes publications qui n'ont qu'une image.
    const postImages = Array.isArray(images)
      ? images.filter((item) => typeof item === "string" && item.length > 0)
      : typeof image === "string" && image
        ? [image]
        : [];

    const post = await Post.create({
      author: req.userId,
      content: content.trim(),
      type: type || "general",
      image: postImages[0] || image || "",
      images: postImages,
      title: title || "",
      product: product || {},
      productName: productName || "",
      productPrice: productPrice ?? null,
      status: currentUser.role === "admin" ? "approved" : "pending",
    });
// Notifier les administrateurs lorsqu'un client publie un post.
if (currentUser.role !== "admin") {
  const admins = await User.find({ role: "admin" }).select("_id");

  if (admins.length > 0) {
    const authorName = currentUser.name || "Un client";

    await Notification.insertMany(
      admins.map((admin) => ({
        recipient: admin._id,
        post: post._id,
        type: "new_post",
        message: `${authorName} a soumis une nouvelle publication en attente de validation.`,
      }))
    );
  }
}
    await post.populate("author", "name");

    console.log("Publication enregistrée :", {
      id: post._id.toString(),
      status: post.status,
      nombreDePhotos: post.images.length,
    });

    res.status(201).json({
      success: true,
      message: "Publication enregistrée avec succès !",
      post,
    });
  } catch (error) {
   console.error("Erreur de création de publication :", error);
console.error("Détails :", error.message);
    res.status(500).json({
      success: false,
      message: "Impossible d'enregistrer la publication.",
    });
  }
});


// RÉCUPÉRER LES PUBLICATIONS DU CLIENT CONNECTÉ
app.get("/api/posts/my-posts", authenticateToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(
      "Erreur récupération de mes publications :",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer vos publications.",
    });
  }
});

 // RÉCUPÉRER LES PUBLICATIONS EN ATTENTE — ADMIN UNIQUEMENT
app.get(
  "/api/admin/posts/pending",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const posts = await Post.find({ status: "pending" })
        .populate("author", "name email")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        posts,
        count: posts.length,
      });
    } catch (error) {
      console.error(
        "Erreur récupération des publications en attente :",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Impossible de récupérer les publications en attente.",
      });
    }
  }
);

 
 // MODÉRER UNE PUBLICATION ET NOTIFIER SON AUTEUR — ADMIN UNIQUEMENT
app.patch(
  "/api/admin/posts/:id/moderation",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { status, rejectionReason } = req.body;
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Identifiant de publication invalide.",
        });
      }

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Choisis une approbation ou un rejet.",
        });
      }

      if (
        status === "rejected" &&
        typeof rejectionReason === "string" &&
        rejectionReason.trim().length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message: "Le motif ne doit pas dépasser 1000 caractères.",
        });
      }

      const update = {
        status,
        rejectionReason:
          status === "rejected" && typeof rejectionReason === "string"
            ? rejectionReason.trim()
            : "",
      };

      // Vérifier que la publication est encore en attente.
      // Cela évite de notifier plusieurs fois pour la même modération.
      const post = await Post.findOneAndUpdate(
        { _id: id, status: "pending" },
        update,
        { new: true, runValidators: true }
      ).populate("author", "name email");

      if (!post) {
        const existingPost = await Post.findById(id);

        if (!existingPost) {
          return res.status(404).json({
            success: false,
            message: "Publication introuvable.",
          });
        }

        return res.status(409).json({
          success: false,
          message: "Cette publication a déjà été modérée.",
        });
      }

      const postTitle =
        post.title?.trim() ||
        (post.content || "").trim().slice(0, 60) ||
        "votre publication";

      const message =
        status === "approved"
          ? `Votre publication « ${postTitle} » a été approuvée et est maintenant visible.`
          : `Votre publication « ${postTitle} » a été rejetée.${
              update.rejectionReason
                ? ` Motif : ${update.rejectionReason}`
                : ""
            }`;

      // Enregistrer la notification dans MongoDB.
      await Notification.create({
        recipient: post.author._id,
        post: post._id,
        type: status === "approved" ? "post_approved" : "post_rejected",
        message,
      });

      res.json({
        success: true,
        message:
          status === "approved"
            ? "Publication approuvée et auteur notifié."
            : "Publication rejetée et auteur notifié.",
        post,
      });
    } catch (error) {
      console.error("Erreur de modération ou de notification :", error.message);

      res.status(500).json({
        success: false,
        message: "Impossible de modérer la publication ou d'envoyer la notification.",
      });
    }
  }
);


 // SUPPRIMER UNE PUBLICATION — ADMIN UNIQUEMENT
app.delete(
  "/api/admin/posts/:id",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Identifiant de publication invalide.",
        });
      }

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Publication introuvable.",
        });
      }

      await Post.findByIdAndDelete(id);

      // Retirer cette publication des publications enregistrées par les utilisateurs.
      await User.updateMany(
        { savedPosts: id },
        { $pull: { savedPosts: id } }
      );

      // Supprimer les notifications associées à cette publication.
      await Notification.deleteMany({ post: id });

      res.json({
        success: true,
        message: "Publication supprimée avec succès.",
        postId: id,
      });
    } catch (error) {
      console.error("Erreur de suppression de publication :", error.message);

      res.status(500).json({
        success: false,
        message: "Impossible de supprimer la publication.",
      });
    }
  }
);

 // RÉCUPÉRER LES PUBLICATIONS APPROUVÉES — ADMIN UNIQUEMENT
app.get(
  "/api/admin/posts/approved",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const posts = await Post.find({ status: "approved" })
        .populate("author", "name")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        posts,
      });
    } catch (error) {
      console.error(
        "Erreur de récupération des publications approuvées :",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Impossible de récupérer les publications approuvées.",
      });
    }
  }
);

 // COMPTER LES PUBLICATIONS EN ATTENTE — NOTIFICATIONS ADMIN
app.get(
  "/api/admin/posts/pending-count",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const count = await Post.countDocuments({
        status: "pending",
      });

      res.json({
        success: true,
        count,
      });
    } catch (error) {
      console.error(
        "Erreur comptage des publications en attente :",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Impossible de compter les publications en attente.",
      });
    }

  }
);

// LIKER UNE PUBLICATION
// ENREGISTRER OU RETIRER UNE PUBLICATION — CLIENT CONNECTÉ
// RÉCUPÉRER LES IDENTIFIANTS DES PUBLICATIONS ENREGISTRÉES
app.get("/api/posts/saved-ids", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId).select("savedPosts");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    res.json({
      success: true,
      savedPostIds: (currentUser.savedPosts || []).map((id) =>
        id.toString()
      ),
    });
  } catch (error) {
    console.error(
      "Erreur de récupération des publications enregistrées :",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les publications enregistrées.",
    });
  }
});
app.patch("/api/posts/:id/save", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Identifiant de publication invalide.",
      });
    }

    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Publication introuvable.",
      });
    }

    const alreadySaved = currentUser.savedPosts.some(
      (savedPostId) => savedPostId.toString() === id
    );

    if (alreadySaved) {
      currentUser.savedPosts.pull(id);
      await currentUser.save();

      return res.json({
        success: true,
        saved: false,
        message: "Publication retirée des enregistrements.",
      });
    }

    currentUser.savedPosts.addToSet(id);
    await currentUser.save();

    // Notifier les administrateurs uniquement lorsqu'un client enregistre le post.
    if (currentUser.role !== "admin") {
      const admins = await User.find({ role: "admin" }).select("_id");

      if (admins.length > 0) {
        const postTitle =
          post.title?.trim() ||
          post.content?.trim().slice(0, 60) ||
          "Publication";

        await Notification.insertMany(
          admins.map((admin) => ({
            recipient: admin._id,
            post: post._id,
            type: "post_saved",
            message: `${currentUser.name} a enregistré la publication « ${postTitle} ».`,
          }))
        );
      }
    }

    res.json({
      success: true,
      saved: true,
      message: "Publication enregistrée avec succès.",
    });
  } catch (error) {
    console.error("Erreur d'enregistrement de la publication :", error.message);

    res.status(500).json({
      success: false,
      message: "Impossible d'enregistrer la publication.",
    });
  }
});
 // RÉCUPÉRER LES NOTIFICATIONS DE L'UTILISATEUR CONNECTÉ
app.get("/api/notifications", authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.userId,
    }).sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      recipient: req.userId,
      isRead: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Erreur récupération notifications :", error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les notifications.",
    });
  }
});

// COMPTER LES NOTIFICATIONS NON LUES
app.get(
  "/api/notifications/unread-count",
  authenticateToken,
  async (req, res) => {
    try {
      const count = await Notification.countDocuments({
        recipient: req.userId,
        isRead: false,
      });

      res.json({ success: true, count });
    } catch (error) {
      console.error("Erreur comptage notifications :", error.message);

      res.status(500).json({
        success: false,
        message: "Impossible de compter les notifications.",
      });
    }
  }
);

// MARQUER UNE NOTIFICATION COMME LUE
app.patch(
  "/api/notifications/:id/read",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Identifiant de notification invalide.",
        });
      }

      const notification = await Notification.findOneAndUpdate(
        { _id: id, recipient: req.userId },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification introuvable.",
        });
      }

      res.json({
        success: true,
        message: "Notification marquée comme lue.",
        notification,
      });
    } catch (error) {
      console.error("Erreur lecture notification :", error.message);

      res.status(500).json({
        success: false,
        message: "Impossible de modifier la notification.",
      });
    }
  }
);

// MARQUER TOUTES LES NOTIFICATIONS COMME LUES
app.patch(
  "/api/notifications/read-all",
  authenticateToken,
  async (req, res) => {
    try {
      await Notification.updateMany(
        { recipient: req.userId, isRead: false },
        { isRead: true }
      );

      res.json({
        success: true,
        message: "Toutes les notifications ont été marquées comme lues.",
      });
    } catch (error) {
      console.error("Erreur lecture notifications :", error.message);

      res.status(500).json({
        success: false,
        message: "Impossible de modifier les notifications.",
      });
    }
  }
);


app.patch("/api/posts/:id/like", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Identifiant de publication invalide.",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Publication introuvable.",
      });
    }

    const alreadyLiked = post.likedBy.some(
      (likedUserId) => likedUserId.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likedBy.pull(userId);
      await post.save();

      return res.json({
        success: true,
        liked: false,
        likes: post.likedBy.length,
      });
    }

    post.likedBy.addToSet(userId);
    await post.save();

   
    // Notifier l'auteur ou, si le client aime sa propre publication, les administrateurs.
    const currentUser = await User.findById(userId).select("name role");

    if (currentUser) {
      const postTitle =
        post.title?.trim() ||
        post.content?.trim().slice(0, 60) ||
        "votre publication";

      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.author,
          post: post._id,
          type: "post_liked",
          message: `${currentUser.name || "Un utilisateur"} a aimé votre publication « ${postTitle} ».`,
        });
      } else if (currentUser.role !== "admin") {
        const admins = await User.find({ role: "admin" }).select("_id");

        if (admins.length > 0) {
          await Notification.insertMany(
            admins.map((admin) => ({
              recipient: admin._id,
              post: post._id,
              type: "post_liked",
              message: `${currentUser.name || "Un client"} a aimé sa propre publication « ${postTitle} ».`,
            }))
          );
        }
      }
    }


    res.json({
      success: true,
      liked: true,
      likes: post.likedBy.length,
    });
  } catch (error) {
    console.error("Erreur lors du like :", error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de modifier le like.",
    });
  }
});



 // AJOUTER UN COMMENTAIRE À UNE PUBLICATION
app.post("/api/posts/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Identifiant de publication invalide.",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le commentaire ne peut pas être vide.",
      });
    }

    if (text.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Le commentaire ne doit pas dépasser 1000 caractères.",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Publication introuvable.",
      });
    }

    post.comments.push({
      user: req.userId,
      text: text.trim(),
    });

    await post.save();

   
const currentUser = await User.findById(req.userId).select("name role");

if (currentUser) {
  const commentText = text.trim();
  const commentPreview = `${commentText.slice(0, 100)}${commentText.length > 100 ? "…" : ""}`;
  const authorIsCommenter =
    post.author.toString() === req.userId.toString();

  const notificationMessage =
    `${currentUser.name || "Un utilisateur"} a commenté la publication : « ${commentPreview} »`;

  if (!authorIsCommenter) {
    await Notification.create({
      recipient: post.author,
      post: post._id,
      type: "post_commented",
      message: notificationMessage,
    });
  } else if (currentUser.role !== "admin") {
    const admins = await User.find({ role: "admin" }).select("_id");

    if (admins.length > 0) {
      await Notification.insertMany(
        admins.map((admin) => ({
          recipient: admin._id,
          post: post._id,
          type: "post_commented",
          message: notificationMessage,
        }))
      );
    }
  }
}


    const updatedPost = await Post.findById(post._id)
      .populate("comments.user", "name");

    res.status(201).json({
      success: true,
      comments: updatedPost.comments,
    });
  } catch (error) {
    console.error("Erreur ajout commentaire :", error.message);

    res.status(500).json({
      success: false,
      message: "Impossible d'ajouter le commentaire.",
    });
  }
});


// RÉCUPÉRER LES COMMENTAIRES D'UNE PUBLICATION
app.get("/api/posts/:id/comments", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Identifiant de publication invalide.",
      });
    }

    const post = await Post.findById(req.params.id)
      .populate("comments.user", "name");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Publication introuvable.",
      });
    }

    res.json({
      success: true,
      comments: post.comments || [],
    });
  } catch (error) {
    console.error("Erreur récupération commentaires :", error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les commentaires.",
    });
  }
});


// CONNEXION MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté ✅");
    console.log("Base utilisée par le backend :", mongoose.connection.name);
    console.log("Serveur MongoDB :", mongoose.connection.host);
  })
  .catch((error) => {
    console.error("Erreur MongoDB ❌ :", error.message);
  });
// INSCRIPTION
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Le nom, l'email et le mot de passe sont obligatoires.",
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Les informations fournies sont invalides.",
      });
    }
mongoose
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Cette adresse email est déjà utilisée.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // L'inscription publique crée toujours un compte client.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "customer",
    });

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès !",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur inscription :", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Cette adresse email est déjà utilisée.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du compte.",
    });
  }
});

// CONNEXION
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "L'email et le mot de passe sont obligatoires.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET absent du fichier .env");

      return res.status(500).json({
        success: false,
        message: "La configuration du serveur est incomplète.",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Connexion réussie !",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur connexion :", error.message);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion.",
    });
  }
});

// RÉCUPÉRER LE PROFIL DE L'UTILISATEUR CONNECTÉ
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "_id name email role"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur récupération du profil :", error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer le profil.",
    });
  }
});

// MODIFIER LE PROFIL DE L'UTILISATEUR CONNECTÉ
app.put("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      !name.trim() ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Le nom et l'adresse e-mail sont obligatoires.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.userId },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Cette adresse email est déjà utilisée.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        name: name.trim(),
        email: normalizedEmail,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("_id name email role");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    res.json({
      success: true,
      message: "Profil mis à jour avec succès.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Erreur modification du profil :", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Cette adresse email est déjà utilisée.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Impossible de modifier le profil.",
    });
  }
});


 // STATISTIQUES DES COMMANDES DE L'UTILISATEUR CONNECTÉ
app.get("/api/orders/my-stats", authenticateToken, async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.userId });


    const stats = {
      enCours: userOrders.filter((order) =>
        ["En attente", "Confirmée", "En préparation", "Expédiée"].includes(
          order.status
        )
      ).length,
      livrees: userOrders.filter((order) => order.status === "Livrée").length,
      annulees: userOrders.filter((order) => order.status === "Annulée").length,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Erreur statistiques commandes :", error.message);
    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les statistiques des commandes.",
    });
  }
});

app.get(
  "/api/orders/admin-stats",
  authenticateToken,
  async (req, res) => {
    try {
      // Vérifier que l'utilisateur connecté est administrateur
      const User = require("./models/User");
      const currentUser = await User.findById(req.userId);
      console.log("Rôle de l'utilisateur :", currentUser?.role);

      if (!currentUser || currentUser.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux administrateurs.",
        });
      }

      // Récupérer toutes les commandes
      const allOrders = await Order.find();

      const stats = {
        enCours: allOrders.filter((order) =>
          [
            "En attente",
            "Confirmée",
            "En préparation",
            "Expédiée",
          ].includes(order.status)
        ).length,

        livrees: allOrders.filter(
          (order) => order.status === "Livrée"
        ).length,

        annulees: allOrders.filter(
          (order) => order.status === "Annulée"
        ).length,
      };

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error(
        "Erreur statistiques administrateur :",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Impossible de récupérer les statistiques.",
      });
    }
  }
);

 // RÉCUPÉRER L'HISTORIQUE DES COMMANDES DU CLIENT CONNECTÉ
app.get("/api/orders/my-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Erreur récupération historique :", error.message);

    res.status(500).json({
      success: false,
      message: "Impossible de récupérer l'historique des commandes.",
    });
  }
});

 // ENREGISTREMENT DES COMMANDES
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const { name, fragrance, color, message, photo, phone, address, orderType } =
      req.body;

    if (
      !name ||
      !fragrance ||
      !color ||
      !phone ||
      !address ||
      !orderType
    ) {
      return res.status(400).json({
        success: false,
        message: "Veuillez renseigner tous les champs obligatoires.",
      });
    }

    const order = new Order({
      user: req.userId,
      name,
      fragrance,
      color,
      message: message || "",
      photo: photo || "",
      phone,
      address,
      orderType,
    });

    const savedOrder = await order.save();

    console.log("Commande enregistrée :", savedOrder);

    res.status(201).json({
      success: true,
      message: "Commande enregistrée avec succès 🕯️",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement ❌ :", error.message);

    res.status(400).json({
      success: false,
      message: "Impossible d'enregistrer la commande.",
    });
  }
});


// TEST D'ACCÈS ADMINISTRATEUR
app.get(
  "/api/admin/check",
  authenticateToken,
  authorizeAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: "Accès administrateur autorisé.",
    });
  }
);


// RÉCUPÉRER TOUTES LES COMMANDES — ADMIN UNIQUEMENT
app.get(
  "/api/admin/orders",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      

      res.json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("Erreur récupération des commandes :", error.message);

      res.status(500).json({
        success: false,
        message: "Impossible de récupérer les commandes.",
      });
    }
  }
);


 // MODIFIER LE STATUT D'UNE COMMANDE — ADMIN UNIQUEMENT
app.patch(
  "/api/admin/orders/:id/status",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const allowedStatuses = [
        "En attente",
        "Confirmée",
        "En préparation",
        "Expédiée",
        "Livrée",
        "Annulée",
      ];

      const { status } = req.body;

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Statut de commande invalide.",
        });
      }

      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Identifiant de commande invalide.",
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      ).populate("user", "name email");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Commande introuvable.",
        });
      }

      res.json({
        success: true,
        message: "Statut de la commande mis à jour.",
        order,
      });
    } catch (error) {
      console.error("Erreur mise à jour commande :", error.message);

      res.status(500).json({
        success: false,
        message: "Impossible de mettre à jour la commande.",
      });
    }
  }
);


/* =========================
   MESSAGERIE MINAS CANDLES
========================= */


/* Récupérer le compte administrateur */
app.get("/api/messages/support", authenticateToken, async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" }).select("_id name role");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Aucun administrateur trouvé.",
      });
    }

    res.json({ success: true, admin });
  } catch (error) {
    console.error("Erreur recherche administrateur :", error.message);
    res.status(500).json({
      success: false,
      message: "Impossible de trouver l'administrateur.",
    });
  }
});

/* Récupérer les conversations et les derniers messages */
app.get("/api/messages/conversations", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name role")
      .populate("recipient", "name role")
      .limit(500);

    const conversationsMap = new Map();

    for (const message of messages) {
      const otherUser =
        message.sender._id.toString() === userId.toString()
          ? message.recipient
          : message.sender;

      const otherUserId = otherUser._id.toString();

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      if (
        message.recipient._id.toString() === userId.toString() &&
        !message.isRead
      ) {
        conversationsMap.get(otherUserId).unreadCount += 1;
      }
    }

    res.json({
      success: true,
      conversations: Array.from(conversationsMap.values()),
    });
  } catch (error) {
    console.error("Erreur chargement conversations :", error.message);
    res.status(500).json({
      success: false,
      message: "Impossible de charger les conversations.",
    });
  }
});

// Compter les messages non lus reçus par l'utilisateur connecté
app.get("/api/messages/unread-count", authenticateToken, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.userId,
      isRead: false,
    });

    res.json({ success: true, count });
  } catch (error) {
    console.error("Erreur compteur messages :", error.message);
    res.status(500).json({
      success: false,
      message: "Impossible de récupérer le compteur de messages.",
    });
  }
});
// Récupérer les messages échangés avec un utilisateur
app.get("/api/messages/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Identifiant utilisateur invalide.",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipient: userId },
        { sender: userId, recipient: req.userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name role")
      .populate("recipient", "name role");

    await Message.updateMany(
      { sender: userId, recipient: req.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Erreur chargement messages :", error.message);
    res.status(500).json({
      success: false,
      message: "Impossible de charger les messages.",
    });
  }
});

// Envoyer un message
app.post("/api/messages", authenticateToken, async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    if (!mongoose.isValidObjectId(recipientId)) {
      return res.status(400).json({
        success: false,
        message: "Destinataire invalide.",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le message ne peut pas être vide.",
      });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Le message ne doit pas dépasser 2000 caractères.",
      });
    }

    if (recipientId.toString() === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas vous envoyer un message.",
      });
    }

    const recipient = await User.findById(recipientId).select("_id role");

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Destinataire introuvable.",
      });
    }

    const sender = await User.findById(req.userId).select("_id role");

    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "Expéditeur introuvable.",
      });
    }

    // La messagerie est réservée aux échanges entre clients et administrateurs.
    if (
      (sender.role === "admin" && recipient.role === "admin") ||
      (sender.role !== "admin" && recipient.role !== "admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "La messagerie est réservée aux échanges entre clients et administrateurs.",
      });
    }

    const message = await Message.create({
      sender: req.userId,
      recipient: recipientId,
      content: content.trim(),
    });

    await message.populate("sender", "name role");
    await message.populate("recipient", "name role");

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Erreur envoi message :", error.message);
    res.status(500).json({
      success: false,
      message: "Impossible d'envoyer le message.",
    });
  }
});




// DÉMARRAGE DU SERVEUR
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
