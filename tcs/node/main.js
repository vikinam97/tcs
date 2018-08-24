const fs=require('await-fs');
const tasks=require("./tasks");
const projects=require("./projects");
const unique=require("./script");
const refresh=require("./refresh_token");
//const refresh

async function main()
{
  try
  { console.log("===================Refreshing the Access Token =============== ");
    console.log(await refresh.AccessToken());

    //console.log("running from main");
    var prjctid={"prjctid":[]}

    //fs.readFile('projects.json',function(err,data)
    /*{ var data=JSON.parse(data);
      var len=Object.keys(data.projects).length;
      console.log(len);
      /*var obj={

      }
    });*/
    console.log("====================Reading Projects============================");
    results=await fs.readFile('projects.json');
    results=JSON.parse(results);
    //console.log(results.projects[0].id_string);
    var flen=Object.keys(results.projects).length;
    console.log("=====================Initializing Update Process===================");
    for(var i=90;i<flen;i++)
    { console.log("Percentage Completed => "+i+"%");
      var prjctid=results.projects[i].id_string;
      var prjctname=results.projects[i].name;
      //tasks.getTasks();
      //console.log(await resolveAfter2Seconds(10));

      console.log(await tasks.getTasksbyPrjct(prjctid));
      console.log(await unique.unique(prjctid,prjctname));
      //await projects.getProjects();
      //console.log("completed");
    }

  }
  catch(e)
  {
      console.log(e);
  }
}

main();
