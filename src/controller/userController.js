const prisma = require("../prisma");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserRegister = async (req, res,next) => {
    const { username, password, name, email, phoneNumber, profilePicture } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });
        if (existingUser) {
            return next({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with hashed password
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                email,
                phoneNumber,
                profilePicture
            }
        });

      return  res.status(200).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
       return next({ error: 'Internal Server Error' });
    }
};
const UserLogin = async (req, res,next) => {
    const { username, password } = req.body;

    try {

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return next({ message: 'Invalid username or password' });
        }


        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return next({ message: 'Invalid username or password' });
        }


        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
      return  next({ error: 'Internal Server Error' });
    }
};
const getUserById = async (req, res,next) => {
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return next({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error retrieving user:', error);
     return  next({ error: 'Internal Server Error' });
    }
};
const updateUser = async (req, res,next) => {
    const userId = req.params.id;
    const { username, password, name, email, phoneNumber, profilePicture } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return next({ message: 'User not found' });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username: username || existingUser.username,
                password: hashedPassword || existingUser.password,
                name: name || existingUser.name,
                email: email || existingUser.email,
                phoneNumber: phoneNumber || existingUser.phoneNumber,
                profilePicture: profilePicture || existingUser.profilePicture
            }
        });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
       return next({ error: 'Internal Server Error' });
    }
};
const deleteUser = async (req, res,next) => {
    const userId = req.params.id;

    try {
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return next({ message: 'User not found' });
        }

        await prisma.user.delete({ where: { id: userId } });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return next({ error: 'Internal Server Error' });
    }
};
const getUsers = async (req, res,next) => {
    try {
        const users = await prisma.user.findMany();
        if (!users) {
          return  next({message: "No user found"})
            // return next({ message: "No user found" })
        }
        res.status(200).json({ users })
    }
    catch (error) {
        console.error('Error retrieving users:', error);
       return next({ error: 'Internal Server Error' });
    }
}
const getUserByEmail = async (req, res,next) => {
    const userEmail = req.query.email;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });

        if (!user) {
            return next({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error retrieving user:', error);
       return next({ error: 'Internal Server Error' });
    }
};

module.exports = { UserRegister, UserLogin, getUserById, updateUser, deleteUser,getUsers, getUserByEmail  }