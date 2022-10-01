import type { NextApiRequest, NextApiResponse} from 'next';
import type { respostaPadraoMsg } from '../../types/respostasPadraoMsg';
import nc from 'next-connect';
import { upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarToken } from '../../middlewares/validarTokenJWT';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
      
        try{
            const {descricao, file} = req?.body;

            if(!descricao || descricao.length < 2){
                return res.status(400).json({erro : 'Descrição não é válida'});
            }
    
            if(!descricao){
                return res.status(400).json({erro : 'Imagem é obrigatória'});
            }
            return res.status(200).json({msg : 'Publicação está válida'});
        }catch(e){
            console.log(e);
            return res.status(400).json({erro : 'Erro ao cadastrar publicação'});
        }
});

export const config = {
    api : {
        bodyParser : false
    }
}

export default validarToken(conectarMongoDB(handler));