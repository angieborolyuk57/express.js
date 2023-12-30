const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());

// 1) Middlewares

app.use((req, res, next) => {
    console.log('hello from the middleware');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
    );


//2 Route handlers 

 const getAllTours = (req, res) => {
        console.log(req.requestTime);

res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length, 
            data:{
                tours
            }
        });
    };


    const getTour= (req, res) => {
        const id = req.params.id * 1;
        const tour = tours.find(el => el.id === id);
            if(!tour) {
                return res.status(404).json({
                    status:'fail', 
                    message:'Invalid ID'
                })
            }
        
            res.status(200)
            .json({
                status: 'Success',
                data: {
                tour
                }
            });
        };

        const createTour = (req, res) => {
            const newId = tours[tours.length - 1].id+ 1;
            const newTour = Object.assign({id: newId}, req.body);
            tours.push(newTour);
            
            fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
            res.status(201)
            .json({
                status:'success', 
                data:{
                    tour: newTour
                }
            })
            })
            }   

        
const deleteTour = (req, res) => {
    if( req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail', 
            message: 'Invalid ID'
        });
    }
    res.status(204).json({   //204 no content 
    status: 'success', 
    data: null
    });
    };
const updateTour = (req, res) => {
    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success', 
        data:{
            tour: '<Updated tour here...>'
        }
    });
};


// app.get('api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.patch('api/v1/tours/:id', updateTour);

// 3) Routes 

app
.route('/api/v1/tours')
.get(getAllTours)
.post(createTour);

app
.route('/api/v1/tours/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

// 4) Start the server 

const port = 3000;

app.listen(port, () => {
    console.log(`App running on ${port}...`);
})