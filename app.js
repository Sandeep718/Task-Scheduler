import express from "express";
import bodyParser from "body-parser";
// import ejs from ejs;
import cron from "node-cron"; // Import node-cron
import notifier from "node-notifier"; // Import node-notifier

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const newitems=[];
const workItems=[];
app.get("/", (req, res) => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today  = new Date();
    let day=today.toLocaleDateString("en-US", options);
    res.render("list.ejs",{kind:day, n1:newitems});
  });

  app.post("/",(req,res)=>{
    const n=req.body.newItem;
    const timeInput = req.body.timeInput;
    // if(req.body.list === "WorkList")
    // {
      
        workItems.push(n+" "+timeInput);
        // workItems.push(timeInput);

        // const scheduledTime = new Date(timeInput);
        // scheduledTime.setMinutes(scheduledTime.getMinutes() - 2);
        const [hours, minutes] = timeInput.split(":");
        // Calculate the scheduled time
        const scheduledTime = new Date();
        scheduledTime.setHours(hours);
        scheduledTime.setMinutes(minutes);
        scheduledTime.setMinutes(scheduledTime.getMinutes() - 5);
    
        // Construct the cron schedule pattern
        const schedulePattern = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} * * *`;
    
        // console.log("Scheduled Time:", scheduledTime);
        // console.log("Cron Pattern:", schedulePattern);
    
        cron.schedule(schedulePattern, () => {
            notifier.notify({
                title: "Reminder",
                message: `Your task "${n}" need to be started in 5 minutes.`,
            });
        });

        res.redirect("/work");
    // } 
    // else
    // {
    //   newitems.push(n+" "+timeInput);
    //   // newitems.push(timeInput);
    // }
})

app.get("/work",function(req,res){
  res.render("list",{kind:"workList", n1:workItems});
})

app.get("/about",function(req,res){
  res.render("about");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });