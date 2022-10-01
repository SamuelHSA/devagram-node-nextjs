import multer from "multer";
import cosmicjs from "cosmicjs";

const {
    CHAVE_GRAVACAO_AVATRES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATRES,
    BUCKET_PUBLICACOES,} = process.env;

const Cosmic = cosmicjs();
const BUCKETAVATRES = Cosmic.bucket({
    slug: BUCKET_AVATRES,
    write_key: CHAVE_GRAVACAO_AVATRES
});

const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICACOES,
    write_key: CHAVE_GRAVACAO_PUBLICACOES
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const uploadImagemCosmic = async(req : any) => {
    console.log('uploadImagemCosmic', req);
    if(req?.file?.originalname){
        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };

        console.log('uploadImagemCosmic url', req.url);
        console.log('uploadImagemCosmic media_object', media_object);
        if(req.url && req.url.includes('publicação')){
            return await bucketPublicacoes.addMedia({media : media_object});
        }else{

        } 
    }
}

export {upload,uploadImagemCosmic};