const { singleFileDelete } = require("../config/uploader");
const deleteFile = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await singleFileDelete(
      `${process.env.CLOUDINARY_FOLDER}/${id}`
    );
    res.status(200).json({ success: true, message: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports = { deleteFile };

// const { singleFileDelete } = require("../config/uploader");
// const deleteFile = async (req, res) => {
//   try {
//     const publicId = req.params.id; // This should match the `public_id` from upload
//     const result = await singleFileDelete(publicId); // Delete directly using the full `public_id`
//     res.status(200).json({ success: true, message: result });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// module.exports = { deleteFile };

// const { singleFileDelete } = require("../config/uploader");

// const deleteFile = async (req, res) => {
//   try {
//     const id = req.params.id;
//     console.log("Deleting file with ID:", id);

//     // Remove CLOUDINARY_FOLDER reference if not using a folder
//     const result = await singleFileDelete(id);
//     console.log("Delete result:", result);

//     res.status(200).json({ success: true, message: result });
//   } catch (error) {
//     console.error("Error deleting file:", error);

//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// module.exports = { deleteFile };

// module.exports = { singleFileDelete };
