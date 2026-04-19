import jwt from "jsonwebtoken";

const DEMO_USERS = {
    student: {
        role: "student",
        identifier: "student01",
        password: "student123",
        name: "Student User",
    },
    teacher: {
        role: "teacher",
        identifier: "teacher01",
        password: "teacher123",
        name: "Teacher User",
    },
    admin: {
        role: "admin",
        identifier: "admin@ams.com",
        password: "admin123",
        name: "Admin User",
    },
};

const TOKEN_EXPIRY = "8h";
const JWT_SECRET = process.env.JWT_SECRET?.trim() || "dev-attendance-secret";

const createAuthToken = (user) => {
    return jwt.sign(
        {
            role: user.role,
            identifier: user.identifier,
            name: user.name,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY },
    );
};

export const login = (req, res) => {
    const { role, identifier, password } = req.body;

    if (!role || !identifier || !password) {
        return res.status(400).json({
            success: false,
            message: "Role, identifier, and password are required.",
        });
    }

    const normalizedRole = String(role).toLowerCase();
    const selectedUser = DEMO_USERS[normalizedRole];

    if (!selectedUser) {
        return res.status(400).json({
            success: false,
            message: "Invalid role selected.",
        });
    }

    const idMatches =
        String(identifier).trim().toLowerCase() === selectedUser.identifier.toLowerCase();
    const passwordMatches = String(password) === selectedUser.password;

    if (!idMatches || !passwordMatches) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials.",
        });
    }

    const token = createAuthToken(selectedUser);

    return res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        user: {
            role: selectedUser.role,
            identifier: selectedUser.identifier,
            name: selectedUser.name,
        },
    });
};

export const logout = (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logout successful.",
    });
};

export const getCurrentUser = (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
};
