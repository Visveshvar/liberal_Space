import Space from "../models/spaces.model.js"


export const generateCode = (base) => {
    const cleaned = base.replace(/\s+/g, '').toUpperCase();
    const randomPart = Array(5)
        .fill(0)
        .map(() => Math.random().toString(36)[2].toUpperCase())
        .join('');
    return (cleaned + randomPart).substring(0, 7);
};

export const createSpace = async (req, res) => {
    try {
        const spaceName = req.body.spaceName?.trim();
        const userId = req.user._id;

        console.log(spaceName);
        console.log(userId)
        if (!spaceName || !userId) {
            return res.status(400).json({ message: "spaceName and userId are required" })
        }

        const existingSpace = await Space.findOne({ spaceName, adminId: userId });

        if (existingSpace) {
            return res.status(409).json({ message: "Space already exists for this user" });
        }


        let code;
        let codeExists = true;

        while (codeExists) {
            code = generateCode(spaceName);
            codeExists = await Space.findOne({ code });
        }

        const newSpace = new Space({
            spaceName,
            adminId: userId,
            code,
            members: [{ memberId: userId }],
        })

        await newSpace.save();

        res.status(201).json({
            message: "Space created successfully",
            space: newSpace,
        });

    }
    catch (err) {
        console.error("Error creating space:", err);
        res.status(500).json({ message: "Server error" });
    }
}