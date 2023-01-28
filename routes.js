const express = require("express")
const products = require("./models/product")
const admins = require("./models/admin")
const users = require("./models/user")
const cart = require("./models/cart")
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = express.Router()

const config = {
    endpoint: "storage.iran.liara.space",
    accessKeyId: "eqss15b29kui5k3e",
    secretAccessKey: "fe0840e4-7132-4b1d-8f31-86ac500e8e0e",
    region: "default",
};

const s3 = new AWS.S3(config);

const upload = multer({
    storage: multerS3({
        s3,
        bucket: "shoping-cart",
        key: function (req, file, cb) {
            console.log(file);
            cb(null, "avnlkhdtbgaksjfnglvbhalgcje_"+file.originalname);
        },
    }),
});

router.post('/products', upload.single('img'), async (req, res) => {
    let {name, detail, price, category} = req.body
    let p = new products({
        "title": name,
        "price": price,
        "description": detail,
        "category": category,
        "image":req.file.location,
        "rating":{
            "rate":0,
            "count":0
        }
    })
    await p.save()
    res.json(p)
})

router.get('/products', (req, res) => {
    products.find({}, (err, docs) => {
        if (err) throw err
        res.json(docs)
    })
})

router.delete('/products/:id', (req, res) => {
    const {id} = req.params
    products.findByIdAndRemove(id, (err) => {
        if (err) throw err
        res.json({
            status: true
        })
    })
})

router.post('/users/register', (req, res) => {
    const {email, name, password} = req.body
    if (!email || !name || !password) {
        throw new Error("hame field ha ra vared konid")
    }
    users.findOne({email}, (err, doc) => {
        if (err) throw err
        if (doc) throw new Error("user az gabl vojud darad")
        let user = new users({
            name,
            email,
            password
        })
        user.save().then(() => {
            res.json(user)
        }).catch(err => {
            throw err
        })
    })
})

router.post('/users/login', (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        throw new Error("hame field ha ra vared konid")
    }
    users.findOne({email}, (err, doc) => {
        if (err) throw err
        if (!doc) throw new Error("user yaft nashod")
        if (doc.password != password) throw new Error("password eshtebah ast")
        res.json({
            status: true,
            token: doc.email
        })
    })
})

router.post('/admins/register', (req, res) => {
    const {email, name, password} = req.body
    if (!email || !name || !password) {
        throw new Error("hame field ha ra vared konid")
    }
    admins.findOne({email}, (err, doc) => {
        if (err) throw err
        if (doc) throw new Error("user az gabl vojud darad")
        let user = new admins({
            name,
            email,
            password
        })
        user.save().then(() => {
            res.json(user)
        }).catch(err => {
            throw err
        })
    })
})

router.post('/admins/login', (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        throw new Error("hame field ha ra vared konid")
    }
    admins.findOne({email}, (err, doc) => {
        if (err) throw err
        if (!doc) throw new Error("user yaft nashod")
        if (doc.password != password) throw new Error("password eshtebah ast")
        res.json({
            status: true,
            token: doc.email
        })
    })
})

router.get('/users', (req, res) => {
    users.find({}, (err, list) => {
        if (err) throw err
        res.json(list)
    })
})

router.get('/admins', (req, res) => {
    admins.find({}, (err, list) => {
        if (err) throw err
        res.json(list)
    })
})

router.delete('/users/:id', (req, res) => {
    const id = req.params.id
    users.findByIdAndRemove(id, (err) => {
        if (err) throw err
        res.json({
            status: true
        })
    })
})

router.delete('/admins/:id', (req, res) => {
    const id = req.params.id
    admins.findByIdAndRemove(id, (err) => {
        if (err) throw err
        res.json({
            status: true
        })
    })
})


module.exports = router