import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import auth from "./middlewares/auth.js";
import cors from "cors";

const app = express();
app.use(express.json());

//Configurando o cors, dizendo que qualquer um pode usar a API
app.use(cors());

app.use("/", publicRoutes);

/*Quando colocamos o auth antes, ele entende que antes de qualquer rota privada, 
ele tem que acessar o auth onde verifica se deve ou não ser exibido essa informação */
app.use("/", auth, privateRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando 😍");
});
