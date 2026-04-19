import bcrypt from "bcryptjs";
import User from "../models/User.js";

const MANAGED_ROLES = ["teacher", "student"];

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    identifier: user.identifier,
    role: user.role,
    createdBy: user.createdBy,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const createManagedUser = async (req, res) => {
    try {
        const { role, name, identifier, password } = req.body;

        if (!role || !name || !identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Role, name, identifier, and password are required.",
            });
        }

        const normalizedRole = String(role).trim().toLowerCase();
        const normalizedIdentifier = String(identifier).trim().toLowerCase();
        const trimmedName = String(name).trim();

        if (!MANAGED_ROLES.includes(normalizedRole)) {
            return res.status(400).json({
                success: false,
                message: "Admin can only create teacher or student accounts.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }

        const existingUser = await User.findOne({ identifier: normalizedIdentifier });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Identifier already exists. Please use a unique identifier.",
            });
        }

        const passwordHash = await bcrypt.hash(String(password), 10);

        const newUser = await User.create({
            role: normalizedRole,
            name: trimmedName,
            identifier: normalizedIdentifier,
            passwordHash,
            createdBy: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: `${normalizedRole} account created successfully.`,
            user: sanitizeUser(newUser),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create user right now.",
            error: error.message,
        });
    }
};

export const getManagedUsers = async (req, res) => {
    try {
        const queryRole = String(req.query.role || "").trim().toLowerCase();

        const filters = {
            role: MANAGED_ROLES.includes(queryRole)
                ? queryRole
                : { $in: MANAGED_ROLES },
        };

        const users = await User.find(filters)
            .select("name identifier role createdBy createdAt updatedAt")
            .sort({ createdAt: -1 });

        const [teacherCount, studentCount] = await Promise.all([
            User.countDocuments({ role: "teacher" }),
            User.countDocuments({ role: "student" }),
        ]);

        return res.status(200).json({
            success: true,
            users: users.map(sanitizeUser),
            summary: {
                teachers: teacherCount,
                students: studentCount,
                totalManaged: teacherCount + studentCount,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch users right now.",
            error: error.message,
        });
    }
};
