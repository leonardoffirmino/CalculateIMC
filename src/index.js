const express = require('express');

const { v4: uuidv4 } = require('uuid');

const app = express();


app.use(express.json());

const calculateImc = [];

function checkUserExists(request,response,next){
    const {username} = request.headers;

    const user = calculateImc.find(user => user.username === username);

    if(!user){
        return response.status(404).json({error:"User not found!!"});
    };

    request.user = user;

    return next();
}

function getBalance(imc){
   const result = imc.map((value) =>{
        const returnWeight = parseFloat(value.height) * parseFloat(value.height) ;
       
        valueResult =  value.weight / returnWeight;

        return valueResult;

    })

    return result;
    
   
   
    
}


app.post('/name',(request,response)=>{
    const {username} = request.body;

    const userExist = calculateImc.find(user => user.username === username);

    if(userExist) {
        return response.status(400).json({error:"Username already exist!"});
    }

    const user = {
        id:uuidv4(),
        username,
        created_at:new Date(),
        imc:[]
    };

    calculateImc.push(user);
    
    return response.status(200).json(user);
});

app.get('/imc',checkUserExists,(request,response)=>{
    const {user} = request;

    return response.json(user.imc);

    
});

app.post('/imc',checkUserExists,(request,response)=>{
    const {user} = request;

    const {name,weight,height} = request.body;

    const registerImc = {
        id:uuidv4(), 
        name,
        weight,
        height,
        created_at: new Date()
    };

    user.imc.push(registerImc);

    return response.status(200).json(registerImc);


});

app.get('/balance',checkUserExists,(request,response)=>{
    const {user} =request;

    const balance = getBalance(user.imc);

    return response.json(balance);
});

app.put('/imcupdate/:id',checkUserExists,(request,response)=>{
    const {user} = request;
    const {id} = request.params;
    const {name,weight,height} = request.body;


    const imcUpdate = user.imc.find(user => user.id === id);

    if(!imcUpdate){
        return response.status(404).json({error:"User not found !!"});
    }

    imcUpdate.name = name;
    imcUpdate.weight = weight;
    imcUpdate.height = height;

    return response.status(200).json(imcUpdate);
    

});

app.delete('/account/:id',checkUserExists,(request,response)=>{
    const {id} = request.params;
    const {user} = request;

    const imcIndex = user.imc.findIndex(imc => imc.id === id);

    if(imcIndex === -1){
        return response.status(404).json({error:"Imc not located!!"});
    }

    user.imc.splice(imcIndex,1);

    return response.status(200).json();
});

app.get('/balance',checkUserExists,(request,response)=>{
    const {user} = request;

    const balance = getBalance(user.imc);

    return response.json(balance);
});




module.exports = app;