const https=require("https");
const parser=require("node-html-parser");




function Get_Info(){
    


    console.log("getting info");
    const header={
        headers:{
          "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
        }
      }
    let url="https://www.musinsa.com/search/musinsa/integration?type=&q="+"패딩";
    https.get(url,header,(res)=>{
        let data="";
        res.on("data",(d)=>{
            data+=d;
        })
        res.on("end",()=>{
            
            //브랜드
            let root=parser.parse(data);
            root.querySelectorAll(".item_title").forEach((list)=>{
                console.log(list.innerText.trim());
                document.getElementById('brand').value=list[0].innerText.trim();
            });
            console.log("");
            //제품이름
            root.querySelectorAll(".list_info a[title]").forEach((list)=>{
                console.log(list.innerText.trim());
                document.getElementById("name").value=list[0].innerText.trim();
            });
            console.log("");
            //가격
            root.querySelectorAll(".price").forEach((list)=>{
                console.log(list.innerText.trim());
                document.getElementById("price").value=list[0].innerText.trim();
            });
            console.log("");
            //사진 url
            root.querySelectorAll("div.list_img > a > img.lazyload.lazy").forEach((list)=>{
                console.log(list.attributes['data-original']);
            });
    
        });
    })
}


document.getElementById('test').onclick=Get_Info;




