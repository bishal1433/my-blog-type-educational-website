// {useNewUrlParser: true, useUnifiedTopology: true})
//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Every individual wants to receive the best of education to achieve his or her dreams. However, the more the institution is good, the higher the fees they charge. Students usually leave their education incomplete and do blue collar jobs to meet their basic ends. Moreover, these students collect money to complete their masters later in career. Apart from those who can afford expensive higher education, some handful of students gets scholarships.";

const aboutContent = `The Great Learner Team offers structured lecture on various courses, school syllabus, competitive exams and many more from Youtube.We believe every individual is different and talented, what you need is passion and curiosity to achieve your dream goals.

The Great Learner  is an educational organization and we are committed to provide the best learning experience. Education is a fundamental human right and it promotes individual empowerment. Education is not all about studying and getting good marks but means to discover new things and increase one's knowledge. An educated person has the ability to differentiate between right and wrong or good and evil. It is the foremost responsibility of a society to educate its citizens. We believe in education for all and we are redefining education from the bottom up.`;

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://bishal:bishal-1433@cluster1.89hcx.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

// app.get("/compose", function(req, res){
//   res.render("compose");
// });

app.post("/login",function(req,res){
  res.render(`login`);
});
//security building....
app.post("/auth",function(req,res){
  const userGivenPasskey=req.body.passKey2;
  const secretPasskey="covid-2021";
  if(secretPasskey===userGivenPasskey){
    res.render("compose");
  }
  else{
    res.send(`<h1>OOPs!!!<br>Password is incorrect, please contact to Admin.</h1>`)
  }
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    // console.log(post);//important......
    res.render("post", {
      title: post.title,
      content: post.content,
      id: requestedPostId
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


//deleting my post...
app.post(`/delete`,function(req,res){
  const passKey=req.body.passkey;
  const del=req.body.deleteId;

  const secretKey="covid-2021";

  if(secretKey===passKey){
    console.log("successfully deleted");
    Post.findByIdAndRemove(del,function(err){
      if(err){
        console.log(err);
      }else{
        res.redirect(`/`);
      }
    });
  }else{
    res.send(`<h1>OOPs!!Please try correct Password.</h1>`);
  }
});


app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
