const express = require('express');
const { auth, db, storage } = require('./Auth/config');
const app = express();
app.use(express.json());

// Route to handle user signup
app.post("/signup", async (req, res) => {
    const { email, password, age, phoneNumber } = req.body;
    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const { uid } = userCredential.user;

        // Create a new document in Firestore with user data
        await db.collection('Users').doc(uid).set({
            email,
            age,
            phoneNumber
        });

        // Return UID of the created user
        res.status(201).json({ uid });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
});

// Route to handle user login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Sign in with email and password
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const { uid } = userCredential.user;

        // Return UID of the logged in user
        res.json({ uid });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(401).json({ message: "Invalid credentials" });
    }
});
// Route to delete user data by UID
app.delete("/delete/:uid", async (req, res) => {
    const uid = req.params.uid;
    try {
        // Check if the user exists in Firestore
        const userDoc = await db.collection('Users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get the authenticated user
        const currentUser = auth.currentUser;
        if (!currentUser || currentUser.uid !== uid) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Delete the user's document from Firestore
        await db.collection('Users').doc(uid).delete();

        // Delete the user's authentication account
        await currentUser.delete();

        res.json({ message: "User data deleted successfully" });
    } catch (error) {
        console.error("Error deleting user data:", error);
        res.status(500).json({ message: "Error deleting user data" });
    }
});
// Initialize Firebase Storage
app.get("/images", async (req, res) => {
    try {
        // Reference to the 'certificate' folder
        const folderRef = storage.ref('certificateImage');

        // Get a list of all items (files) in the folder
        const { items } = await folderRef.listAll();

        // Array to store image URLs
        const urls = [];

        // Iterate through each item (file) and get its download URL
        for (const itemRef of items) {
            const url = await itemRef.getDownloadURL();
            urls.push(url);
        }

        // Send array of download URLs as JSON response
        res.json({ urls });
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ message: "Error fetching images" });
    }
});
const multer = require('multer');
// Configure multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Specify the destination in Firebase Storage
        const fileName = `certificateImage/${file.originalname}`;

        // Create a reference to the storage bucket
        const storageRef = storage.ref();

        // Upload the file to Firebase Storage
        const snapshot = await storageRef.child(fileName).put(file.buffer);

        // Get the download URL for the uploaded file
        const downloadURL = await snapshot.ref.getDownloadURL();

        return res.status(200).json({ message: 'File uploaded successfully', downloadURL });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ message: 'Error uploading file' });
    }
});


app.listen(4000, () => console.log("The server is running at PORT 4000"));