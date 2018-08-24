const fs=require('await-fs');
const tasks=require("./tasks");
const projects=require("./projects");
const unique=require("./script");
const refresh=require("./refresh_token");
const oracledb=require('oracledb');
//const refresh

var stop='false';

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
    console.log("======="+flen+"==============Initializing Update Process===================");
    //for(var i=0;i<2;i++)
    //{
      //console.log("Percentage Completed => "+i+"%");

      //tasks.getTasks();
      //console.log(await resolveAfter2Seconds(10));
      // let ind=0;
      // let rng=100;
      // for(var j=1;j<=10;j++)
      // {
      //   //console.log("ind = "+ind);
      //   //console.log("rng = "+rng);
      //   ind=(j)*100+1;
      //   rng=rng+100;
      //   //console.log(await tasks.getTasksbyPrjct(prjctid,ind,rng));
      //   //console.log(await unique.unique(prjctid,prjctname));
      //   // console.log(await tasks.getTasksbyPrjct(prjctid,101,200));
      //   // console.log(await unique.unique(prjctid,prjctname));
      //   // console.log(await tasks.getTasksbyPrjct(prjctid,201,300));
      //   // console.log(await unique.unique(prjctid,prjctname));
      // }
      for(var ij=124;ij<=135;ij++)
      {
        stop='false';
        console.log("completed =>"+ij);
        var prjctid=results.projects[ij].id_string;
        console.log(prjctid);
        var prjctname=results.projects[ij].name;
        //console.log(tasks.stop);
        var i=1;
        var j=100;
        while(stop!='true')
        {

          console.log("from = "+i+"  to = "+j);
          stop=await tasks.getTasksbyPrjct(prjctid,i,j);
          console.log(await unique.unique(prjctid,prjctname));
          i=j+1;
          j=j+100;

          if(i>=1000)
          {
            stop='true';
          }
        }
      }


      //await projects.getProjects();
      //console.log("completed");
    //}

  }
  catch(e)
  {
      console.log(e);
  }
}

main();
