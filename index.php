<?php

require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use GuzzleHttp\Client;

Request::setTrustedProxies(array('45.55.144.148'));
$app = new Silex\Application();
$app['debug'] = true;

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));


$lexer = new Twig_Lexer($app['twig'], array(
    'tag_comment'   => array('[#', '#]'),
    'tag_block'     => array('[%', '%]'),
    'tag_variable'  => array('[[', ']]'),
    'interpolation' => array('#[', ']'),
));
$app['twig']->setLexer($lexer);




/**
 * redirecciona al home cuando encuentra un error de doble barra
 */
$app->error(function (\Exception $e, $request, $code) use ($app) {
   
   $pathInfo = $request->getPathInfo();
   $pos = strrpos($pathInfo, "//");
   
    if (404 === $code && $pos !== false) {
        $pathInfo = str_replace("//", "/", $pathInfo);
        $params = $request->getQueryString();
        $basePath = $request->getBasePath();
        return $app->redirect($basePath.$pathInfo.'?'.$params);
    }
   
});


//llama al servicio de 360 que trae un proyecto
$app->get('/', function (Request $request) use ($app) {
    
    return requestProject($request, $app);
});

/**
 * retorna el json del proyecto y renderiza la pagina
 * @param Request $request
 * @param type $app
 * @return type
 */
function requestProject(Request $request, $app){
     $endPoint = "https://www.360magictour.com/admin/api/1.0/projects/"; // prod
//    $endPoint = "https://interactive-3dapps.com/002-mediacombiners-suiza-as/002-magic-tour-app/dev/admin/api/1.0/projects/"; 
        
    $uuid = $request->query->get('project');
    if($uuid !== null){

        $url = $endPoint . $uuid;

        /*************************************
         *
         * Guzzle  (php-curl) implementation
         * 
         * ***********************************/
        
        $client = new GuzzleHttp\Client();        
        $response = $client->get($url);
        $json_data = $response->getBody();
        

        /*************************************
         *
         * libcurl direct 
         * (exec system command) implementation
         * fix bug in php-curl: 
         * "could not resolve host"
         * 
         * ***********************************/
        // $json_data = exec('curl -X GET -H "Cache-Control: no-cache" "'. $url . '"');

        // parsing data
        $json_array_data = (array) json_decode($json_data); 

        $status = 0;
        
        if(isset($json_array_data['status']) && $json_array_data['status'] == '1'){
            $status = 1;
            $title = $json_array_data['info']->name;
            $description = '';
            if(isset($json_array_data['info']->description)){
                $description = $json_array_data['info']->description;
            }
            
            $ambient_image_id = null;
            if(isset($json_array_data['info']->starter_ambientid)){
                $ambient_image_id = $json_array_data['info']->starter_ambientid;
            }
            
            
            if(isset($json_array_data['ambients']) && count($json_array_data['ambients'])>0){
                $image = null;
                if($ambient_image_id !== null){
                    foreach($json_array_data['ambients'] as $ambient){
                        if($ambient->id == $ambient_image_id){
                            $image = $ambient->imgMiniatureUrl;
                            break;
                        }
                    }
                    if($image == null){
                        $image = $json_array_data['ambients'][0]->imgMiniatureUrl;
                    }
                }else{
                    $image = $json_array_data['ambients'][0]->imgMiniatureUrl;
                }
            }
            return $app['twig']->render('index.html',array('title'=>$title, 'image'=> $image, 'description'=> $description, 'json' => json_encode($json_array_data)));
        }else {
            return $app['twig']->render('index.html',array('title'=>'', 'image'=> '', 'description'=> '', 'json' => '{}'));
        }
    }else {
        return $app['twig']->render('index.html',array('title'=>'', 'image'=> '', 'description'=> '', 'json' => '{}'));
    }
}
 
$app->run();


?>