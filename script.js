const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");


let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = () => {
    let file = fileInput.files[0]   //getting user selected file
    if(!file) return; //return if user hasn't selected file
    previewImg.src = URL.createObjectURL(file);  //passing file  url  as previewing image src
    previewImg.addEventListener("load",()=>{
        resetFilterBtn.click(); //clicking  reset btn, so the  filter value reset if the user select new image
        document.querySelector(".container").classList.remove("disable");
    });
}

filterOptions.forEach(option => {
    option.addEventListener("click",() =>{    //adding click event listener to all filter buttons
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness"){
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        }
        else if  (option.id === "saturation"){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }
        else if  (option.id === "inversion"){
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }
        else{
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }

    });
});


const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); //getting selected filter btn

    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
    }
    else if (selectedFilter.id === "saturation"){
        saturation = filterSlider.value;
    }
    else if (selectedFilter.id === "inversion"){
        inversion = filterSlider.value;
    }
    else{
        grayscale = filterSlider.value;
    }
    applyFilters();
}

rotateOptions.forEach(option => {
    option.addEventListener("click",() =>{     //adding event listner to all rotate btns
        if (option.id === "left"){
            rotate -= 90
        }
        else if(option.id === "right"){
            rotate += 90
        }
        else if (option.id === "horizontal"){
            //if flipHorizontal value 1,set this value -1 else set 1;
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        else{
            //if flipVertical value 1,set this value -1 else set 1;
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
});
const resetFilter = () =>{
    //reseting all variable value to the default value
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();  //clicking brightness btn so the brightness selected by default
    applyFilters();
}
const saveImg = () =>{
    const canvas = document.createElement("canvas"); // creaiing canvas element
    const ctx = canvas.getContext("2d"); // canvas.getcontext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth;  //setting the canvas width to the actual width
    canvas.height = previewImg.naturalHeight;  // setting the canvas height to the actual height

    //applying user selected filter to canvas filter
    ctx.filter =  `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width/2, canvas.height/2); //transalting canvas from center

    if(rotate !==0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);  //flip canvas , horizontaly and vertically
    ctx.drawImage(previewImg, -canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    
    const link =document.createElement("a"); //creating <a> element
    link.download = "image.jpg"; //passing <a> download value to image jpg
    link.href = canvas.toDataURL();  // passing <a> href value to canvas data url
    link.click();  //clicking <a> so the image will be downloaded
}
 
fileInput.addEventListener("change",loadImage);
filterSlider.addEventListener("input",updateFilter);
resetFilterBtn.addEventListener("click",resetFilter);
saveImgBtn.addEventListener("click",saveImg);
chooseImgBtn.addEventListener("click",() => fileInput.click());
