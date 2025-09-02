package com.ecommerce.closetculture.utils.appUtils;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

public class Urls_Images {

    public static String getAbsolutePath(String whichImages,String collName,Long id,String filename) throws IOException{

        String path = "closetculture-backend\\uploads\\Images\\"+whichImages+"\\"+collName+"\\"+id;

        Files.createDirectories(Paths.get(path));

        return new File(path).getAbsolutePath()+"\\"+filename;
    }

    public static Resource getResourceUrl(String whichImages,String collName,Long id,String filename) throws MalformedURLException{

        String location = "backend\\closetculture-backend\\uploads\\Images\\"+whichImages+"\\"+collName+"\\"+id+"\\"+filename;

        File file = new File(location);
        
        if(file.exists()){
            Path path = Paths.get(location);
            return new UrlResource(path.toUri());
        }else{
            return null;
        }

    }
    
}
/* CHECK REVISE MATERIAL ---> Image Serving for frontend from backend for detailed understanding!!
OK!! if we upload the images today and and immediately we run the backend in vs code and get the img ,the path we give here is taken 
as a valid url and it will give us the images.

but if we close it and open the backend and run tomorrow,these static files get in .jar and when we again get the image,so it does not
take this path("src\\main\\resources\\static\\Images\\"+whichImages+"\\"+collName+"\\"+id+"\\"+filename) as a valid path and it means/shows 
the file path  is not exist even if we can see it in the menu bar.

so we make the path as classpath resource and use the path.
 */