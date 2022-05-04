npm run build

cp -Rf ./build-assets/* ./build/

s2i build ./build centos/nginx-116-centos7 collection-explorer
