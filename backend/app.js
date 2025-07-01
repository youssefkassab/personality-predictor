const express = require('express');
const onnx = require('onnxruntime-node');
const app = express();

var Features=[];
var PersonalityResult=[];
async function main() {
    try {
        const session = await onnx.InferenceSession.create('./model1.onnx');
        

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



// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","*")
    res.setHeader("Access-Control-Allow-Headers","*")
    next()
})
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.post('/result', (req, res) => {
    Features = req.body.Features;
    main();
    res.send(PersonalityResult);
});

module.exports = app;