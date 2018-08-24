var str="120:40";
var arr=str.split(":");
console.log(arr[0]);
console.log(arr[1]);

//counting the field length

// var fs=require('fs');
// fs.readFile('tasks.json',(err,data)=>{
//   if(err) throw err;
//   tasks=JSON.parse(data);
//   var len=Object.keys(tasks.tasks).length;
//   var j=tasks.tasks[0].percent_complete.length;
//   for(var i=0;i<len;i++)
//   {
//     if(tasks.tasks[0].percent_complete.length)
//     {
//       var val=tasks.tasks[i].percent_complete.length;
//       if(j<val)
//       {
//         var j=val;
//       }
//     }
//   }
//   console.log("maximum value in "+i+" is =>"+j);
// });


//seperating the particularrecord using name

// var fs=require('fs');
// fs.readFile('tasks.json',(err,data)=>{
//   if(err) throw err;
//   tasks=JSON.parse(data);
//   var len=Object.keys(tasks.tasks).length;
//   var j=0;
//   for(var i=0;i<len;i++)
//   {
//     if(tasks.tasks[i].created_person=="IT-SATHISH P")
//     {
//       fs.appendFile("selected.json",JSON.stringify(tasks.tasks[i]),(err,data)=>{
//         if(err) throw err;
//       });j++;
//       //console.log(tasks.tasks[i]);
//     }
//   }
//   console.log("counted "+(j+1));
// });
