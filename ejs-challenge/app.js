//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
 const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.set('strictQuery',false);

mongoose.connect("mongodb://localhost:27017/postDB", {useNewUrlParser: true});


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let posts = [];

  
const postSchema = {
  title  : String,
  content: String
};



const Post = mongoose.model("post", postSchema);



app.get("/",function(req,res){
  
 //console.log(posts);
 Post.find({},function(err,content){
  res.render("home.ejs",{
    home:homeStartingContent,
    posts :content
});
 })
})



app.get("/about",function(req,res){
  res.render("about.ejs",{about:aboutContent});
})




app.get("/contact",function(req,res){
  res.render("contact.ejs",{contact:contactContent});
})


app.get("/compose",function(req,res){
  res.render("compose.ejs");
})

app.post("/compose",function(req,res){
 

  // const post = {
  //   title:req.body.title,
  //   content: req.body.data
  // };


  const post = new Post({
    title:req.body.title,
    content: req.body.data
  })

  //console.log(post);
//posts.push(post);
post.save();
res.redirect('/');
})



app.get("/posts/:link",function(req,res){
  // const requestedtitle = _.lowerCase(req.params.link);


  // posts.forEach(function(post){
  //   const  storedtitle = _.lowerCase(post.title);
  // if(requestedtitle === storedtitle){

  //   res.render("post.ejs",{title:post.title,content:post.content});
  //   //console.log("match found");
  // }else{
  //   console.log("match not found");
  // }
  // })

  const requestedid = req.params.link;

Post.findById(requestedid,function(err,content){
  if (err){
    console.log(err);
}
else{
  res.render("post.ejs",{content:content});
}
}) 
})


app.get("/delete/:id",function(req,res){
  const requestedid = req.params.id;
Post.deleteOne({_id:requestedid},function(err){
  if(err){
    console.log(err)
  }else{
    console.log("successful delete");
    res.redirect("/")
  }
})
})


app.get('/update/:id', function(req, res,) {
      
  const requestedid = req.params.id;
  Post.findById(requestedid,function(err,content){
    res.render("update.ejs",{
      post :content
  }); })
});
  

// app.post("/update",function(req,res){
//   Post.findByIdAndUpdate(req.body._id,{$set: req.body},function(err){
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect("/")
//     }
//   })
  
// })


app.post('/update',function(req, res) {
       Post.findByIdAndUpdate(req.body._id, {$set: {title : req.body.title,content : req.body.data}}, function (err, product) {
               if (!err) {
                res.redirect('/');}
            else {
                res.send(err)
            }
        });
    });

    


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
