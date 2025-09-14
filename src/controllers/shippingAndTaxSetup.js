const ShippingPriceModel = require("../models/shipping-tax");

const GetAllShippingAndTax = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;

        // Pagination parameters
        const pageNumber = parseInt(page, 10) || 1;
        const pageLimit = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageLimit;

        // Search filter
        const query = search
            ? { name: { $regex: search, $options: 'i' } } // Case-insensitive regex for searching by name
            : {};

        // Fetch filtered and paginated setups
        const setups = await ShippingPriceModel.find(query)
            .skip(skip)
            .limit(pageLimit);

        // Get the total count of setups matching the query
        const totalSetups = await ShippingPriceModel.countDocuments(query);

        // Send the response
        res.status(200).json({
            success: true,
            data: setups,
            total: totalSetups,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalSetups / pageLimit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const GetActiveShippingAndTax = async (req, res) => {
    try {
        // Find the active setup
        const activeSetup = await ShippingPriceModel.findOne({ status: 'active' });

        // Check if an active setup exists
        if (!activeSetup) {
            return res.status(404).json({ success: false, message: 'No active setup found' });
        }

        // Return the active setup
        res.status(200).json({ success: true, data: activeSetup });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const UpdateShippingAndTax = async (req, res) => {
    try {
        const { id } = req.params; // ID of the setup to update
        const { name, shipping, tax, status, ...data } = req.body;

        // Check if the setup exists
        const existingSetup = await ShippingPriceModel.findById(id);
        if (!existingSetup) {
            return res.status(404).json({ success: false, message: 'Setup not found' });
        }

        // Update the specific setup
        const updatedSetup = await ShippingPriceModel.findByIdAndUpdate(
            id,
            {
                name: name || existingSetup.name,
                shipping: shipping || existingSetup.shipping,
                tax: tax || existingSetup.tax,
                status: status || existingSetup.status,
                ...data,
            },
            { new: true } 
        );

        // If status is updated to 'Active', set all other setups to 'Inactive'
        if (status === 'active') {
            await ShippingPriceModel.updateMany(
                { _id: { $ne: id } }, // Exclude the current setup
                { status: 'inactive' }
            );
        }

        res.status(200).json({ success: true, data: updatedSetup, message: 'Setup Updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const CreateShippingAndTax = async (req, res) => {
    try {
        const { name, shipping, tax, ...data } = req.body;

        // Validating required fields
        if (!name) {
            return res.status(400).json({ message: 'Name is Required' });
        }
        if (!shipping) {
            return res.status(400).json({ message: 'Shipping Price is Required' });
        }
        if (!tax) {
            return res.status(400).json({ message: 'Tax Amount is Required' });
        }

        // Set all existing setups to 'Inactive'
        if(data.status === 'active'){
            await ShippingPriceModel.updateMany({}, { status: 'inactive' });
        }

        // Create a new setup and mark it as 'Active'
        const setup = await ShippingPriceModel.create({
            name,
            shipping,
            tax,
            ...data,
        });

        res.status(201).json({ success: true, data: setup, message: 'Setup Created' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const DeleteShippingAndTax = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from request parameters

        // Check if the setup exists
        const existingSetup = await ShippingPriceModel.findById(id);
        if (!existingSetup) {
            return res.status(404).json({ success: false, message: 'Setup not found' });
        }

        // Delete the setup
        await ShippingPriceModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Setup deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const GetShippingAndTaxById = async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters

        // Find the setup by ID
        const setup = await ShippingPriceModel.findById(id);

        // Check if the setup exists
        if (!setup) {
            return res.status(404).json({ success: false, message: 'Setup not found' });
        }

        // Send the response with the found setup
        res.status(200).json({ success: true, data: setup });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {GetShippingAndTaxById, CreateShippingAndTax,GetAllShippingAndTax ,UpdateShippingAndTax,GetActiveShippingAndTax,DeleteShippingAndTax};