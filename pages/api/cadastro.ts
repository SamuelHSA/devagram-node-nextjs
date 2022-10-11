import type { NextApiRequest, NextApiResponse} from 'next';
import type { respostaPadraoMsg } from '../../types/respostasPadraoMsg';
import type { CadastroRequisicao } from '../../types/CadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModel';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import md5 from 'md5';
import { updload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import nc from 'next-connect';
import { politicaCORS } from '../../middlewares/politicaCORS';

const handler = nc ()
    .use(updload.single('file'))
    .post(async(req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
        try{
            console.log('cadastro endpoint', req);
            const usuario = req.body as CadastroRequisicao;
        
            if(!usuario.nome || usuario.nome.length < 2){
                return res.status(400).json({erro : 'Nome inválido'});
            }
        
            if(!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')){
                return res.status(400).json({erro : 'Email inválido'});
            }
        
            if(!usuario.senha || usuario.senha.length < 4){
                return res.status(400).json({erro : 'Senha inválida'});
            }
        
            // validacao se ja existe usuario com o mesmo email
            const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
            if(usuariosComMesmoEmail && usuariosComMesmoEmail.length >0){
                return res.status(400).json({erro : 'Já existe uma conta com o email informado'});
            }
        
            //enviar a imagem do multer para o cosmic
            const image = await uploadImagemCosmic(req);
    
            // salvar no banco de dados
            const usuarioAsersalvo = {
                nome : usuario.nome,
                email : usuario.email,
                senha : md5(usuario.senha),
                avatar : image?.media?.url
            }
            await UsuarioModel.create(usuarioAsersalvo);
            return res.status(200).json({msg : 'Usuário criado com sucesso'});
        }catch(e : any){
            console.log(e);
            return res.status(400).json({erro : e.toString()});
        }
});
export const config = {
    api: {
        bodyParser : false 
    }
}

export default politicaCORS(conectarMongoDB(handler));