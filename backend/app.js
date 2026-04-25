const express = require('express');
const onnx = require('onnxruntime-node');
const path = require('path');
const app = express();

// Get the directory where this file is located
const MODEL_PATH = path.join(__dirname, 'model1.onnx');

var Features=[];
var PersonalityResult=[];
async function main() {
    try {
        const session = await onnx.InferenceSession.create(MODEL_PATH);
        

        const data = Float32Array.from(Features);
        const tensor = new onnx.Tensor('float32', data, [1, Features.length]);

        const feeds = { 'float_input': tensor };
     console.log(feeds);
     
        const results = await session.run(feeds);

        const predictionLabel = results.label.data[0];

              PersonalityResult = predictionLabel === 0 ? 'Extrovert' : 'Introvert';

        console.log(`Features: ${Features}`);
        console.log(`Raw Prediction Label: ${predictionLabel}`);
        PersonalityResult = PersonalityResult;
        console.log(`Predicted Personality: ${PersonalityResult}`);

       

    }catch (e) {
        console.error(`failed to inference ONNX model: ${e}.`);
    }
}



// CORS middleware
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","*")
    res.setHeader("Access-Control-Allow-Headers","*")
    next()
})

app.use(express.urlencoded({extended:false}))
app.use(express.json())

// API endpoint (matches frontend call to /api/result)
app.post('/api/result', (req, res) => {
    Features = req.body.Features;
    main();
    res.send(PersonalityResult);
});

// Also keep /result for backward compatibility
app.post('/result', (req, res) => {
    Features = req.body.Features;
    main();
    res.send(PersonalityResult);
});

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// For any other route, serve index.html (SPA behavior)
app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server (for Render and local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;