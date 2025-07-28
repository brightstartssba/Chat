javascript: function checkSaveImage(x,y,url){
            var imgList = document.getElementsByTagName('img');
            for(var i=0;i < imgList.length; i++){
                var  imgObj = imgList[i];
                var  src = imgObj.getAttribute('src');
                var bound = imgObj.getBoundingClientRect();
                var top = bound.top;
                var left = bound.left;
                var right = bound.right;
                var bottom = bound.bottom;
                if(x >= left && x <= right && y >= top && y <= bottom){
                    if(url.indexOf(src)>= 0 ){
                         var saveForbidden;
                         if (imgObj.hasAttribute("forbidden-save")){
                              saveForbidden = imgObj.getAttribute("forbidden-save") == "true";
                         } else {
                              saveForbidden = false;
                         }
                         TenvideoJSBridge.invoke("longPressToSaveImg",{'url':url,'saveForbidden':saveForbidden});
                         break;
                    }
                }
            }
        }