const foodpartner = require('../models/foodpartner.model');

async function updatefoodParnterLocation(req , res){
    const {foodPartnerId} = req.params;
    const {lat,lag} = req.body;


    try{
        const foodPartner = await foodpartner.findById(
            foodPartnerId,{
                location:{
                    type : "Point",
                    coordinate : [lag,lat],
                },
            },
            {new : true}
        );

        if(!foodPartner) return res.status(404).json({message:"Food partner not fount"});

        res.status(200).json({message: "Location updated successfully", foodPartner});
    } catch (error){
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = {
    updatefoodParnterLocation,
}