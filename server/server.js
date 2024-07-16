const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
app.use(express.json());
//connecting to mongodb
mongoose
  .connect("mongodb+srv://shankar:merndevshankar@cyber.10rlby3.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

//Schema Creation
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  domain: String,
  description: String,
});
//Creating the model
const Todo = mongoose.model("Todo", todoSchema);

//posting the data
app.post("/todos", async (req, res) => {
  const { title, domain, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required." });
  }
  try {
    const TodoModel = new Todo({ title, description, domain });
    await TodoModel.save();
    res.status(201).json(TodoModel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//getting the data
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update the data
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, domain, description } = req.body;
    const UpdatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        domain,
        description,
      },
      { new: true }
    );
    if (!UpdatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(UpdatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//deleting the data 
app.delete("/todos/:id",async(req,res)=>
{
    try{
        const {id}=req.params;
        const DeletedTodo = await Todo.findByIdAndDelete(id);
        if(!DeletedTodo)
            {
                return res.status(404).json({error:"Todo not found"});
            }
            res.json({message:"Todo deleted successfully"});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
})
const port = 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
