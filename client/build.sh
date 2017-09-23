mkdir ../../restplayer2/node_modules

mkdir ../../restplayer2/node_modules/bootstrap
cp -R ./node_modules/bootstrap ../../restplayer2/node_modules/

mkdir ../../restplayer2/node_modules/jquery
cp -R ./node_modules/jquery ../../restplayer2/node_modules/

mkdir ../../restplayer2/node_modules/font-awesome
cp -R ./node_modules/font-awesome ../../restplayer2/node_modules/

mkdir ../../settings2/node_modules/tinymce
cp -R ./node_modules/tinymce ../../settings2/node_modules/

mkdir ../../restplayer2/resource
cp -R ./resource ../../restplayer2/

ng build --bh http://editeur.vidal.fr/demo/restplayer2/start/ --output-path ../../restplayer2/start/ --target=production