const promise=require('es6-promise');
var k=50;

var strpass="›¯ÄÇ×öí";
var pass='';
strpass=strpass.split('');
async function main()
{ for(var i=0;i<strpass.length;i++)
  {
    await getpass(i);
  }
  console.log(pass);
}



main();


function getpass(i)
{	return new promise(resolve=>{
			var j =strpass[i].charCodeAt(0);
      console.log(j);
			j = j-k;
      console.log(j);
			if(j<0) j=j+200;
			//console.log(j);
			pass=pass+String.fromCharCode(j);
      k=k+15;
			resolve();
	});

}
