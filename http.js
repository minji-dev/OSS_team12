const https=require("https");
const parser=require("node-html-parser");



let url="https://www.musinsa.com/search/musinsa/integration?type=&q="+"패딩";

https.get(url,(res)=>{
    let data="";
    res.on("data",(d)=>{
        data+=d;
    })
    res.on("end",()=>{
        
        //브랜드
        let root=parser.parse(data);
        root.querySelectorAll(".item_title").forEach((list)=>{
            console.log(list.innerText.trim());
        });
        //제품이름
        root.querySelectorAll(".list_info a[title]").forEach((list)=>{
            console.log(list.innerText.trim());
        })
        //가격
        root.querySelectorAll(".price").forEach((list)=>{
            console.log(list.innerText.trim());
        })
        //사진 url
        let img=root.querySelector(".lazyload.lazy");
        console.log(img.innerHTML);
    });
})




