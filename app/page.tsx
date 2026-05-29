"use client";

import { useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

const usuarios = [
  "Felipe",
  "Felipe casa",
  "Monica Felipe",
  "Liane",
  "Sergio Liane",
  "Liane casa",
  "Isabela",
  "Paulinho",
  "Solange",
  "Solange casa",
  "Luiz",
  "Gabriela",
  "Guto",
  "Aninha",
  "Aninha casa",
  "Miguel",
  "Cris",
  "Marcelo",
  "Marcelo casa",
  "Bel",
  "Leonardo",
  "Leonardo casa",
  "Danielle",
  "Tininha",
  "Regina",
  "Regina casa",
  "Joao",
  "Monica Joao",
  "Claudia",
  "Xande",
  "Xande casa",
  "Ana",
  "Duda",
  "Andre",
  "Andre casa",
  "Ana Paula",
  "Cristina",
  "Cristina casa",
  "Oscar",
  "Roberto",
  "Roberto casa",
  "Jo",
  "Adriana",
  "Guilherme",
  "Beto",
  "Soraia",
  "Alvaro",
  "Alvaro casa",
  "Jane",
  "Angela",
  "Sergio Elza",
  "Elza Maria",
  "Elza Maria casa",
];

const perguntas = [
  {
    id: "pergunta1",

    titulo: "Modelo de contribuição :",

    respostas: [
      " casa 30% do valor total necessário e pessoas 70%",
      " casa 50% do valor total necessário e pessoas 50%",
      " casa 50% do valor total necessário e pessoas 50%" ,
    ],
  },

];

const admin = "ADMIN123";

export default function Home() {
  const [nome, setNome] = useState("");

  const [logado, setLogado] = useState(false);

  const [adminLogado, setAdminLogado] = useState(false);

  const [votou, setVotou] = useState(false);

  const [resultados, setResultados] = useState<any[]>([]);

  const [respostas, setRespostas] = useState<any>({});

  async function login() {
    if (nome === admin) {
      setAdminLogado(true);

      carregarResultados();

      return;
    }

    if (!usuarios.includes(nome)) {
      alert("Nome inválido");

      return;
    }

    const q = query(
      collection(db, "votos"),
      where("nome", "==", nome)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      setVotou(true);
    }

    setLogado(true);
  }

  async function votar() {
    const faltando = perguntas.some(
      (p) => !respostas[p.id]
    );

    if (faltando) {
      alert("Responda todas as perguntas");

      return;
    }

    const peso = nome.toLowerCase().includes("casa")
      ? 2.9
      : 1;

    await addDoc(collection(db, "votos"), {
      nome,
      peso,
      respostas,
      criadoEm: new Date(),
    });

    setVotou(true);

    alert("Voto enviado com sucesso");
  }

  async function carregarResultados() {
    const snapshot = await getDocs(
      collection(db, "votos")
    );

    const lista = snapshot.docs.map((doc) =>
      doc.data()
    );

    setResultados(lista);
  }

  function calcular(perguntaId: string) {
    const total: any = {};

    resultados.forEach((voto) => {
      const resposta = voto.respostas?.[perguntaId];

      if (!resposta) return;

      if (!total[resposta]) {
        total[resposta] = 0;
      }

      total[resposta] += Number(voto.peso);
    });

    return total;
  }

  if (adminLogado) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-bold mb-10">
          Resultados da Votação
        </h1>

        <div className="space-y-12">

          {perguntas.map((pergunta) => {
            const resultado = calcular(pergunta.id);

            return (
              <div key={pergunta.id}>
                <h2 className="text-2xl font-bold mb-4">
                  {pergunta.titulo}
                </h2>

                {Object.entries(resultado).map(
                  ([resposta, valor]) => (
                    <p
                      key={resposta}
                      className="mb-2 text-lg"
                    >
                      {resposta}: {String(valor)}
                    </p>
                  )
                )}
              </div>
            );
          })}

        </div>
      </main>
    );
  }

  if (!logado) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">

          <h1 className="text-3xl font-bold mb-6 text-center">
            Votação Familiar
          </h1>

          <input
            className="w-full p-3 rounded bg-zinc-800 mb-4"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
          />

          <button
            onClick={login}
            className="w-full bg-blue-600 p-3 rounded font-bold"
          >
            Entrar
          </button>

        </div>
      </main>
    );
  }

  if (votou) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold">
          Seu voto já foi registrado.
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">

      <div className="max-w-4xl mx-auto bg-zinc-900 p-8 rounded-2xl">

        <h1 className="text-4xl font-bold mb-10 text-center">
          Votação Familiar
        </h1>

        <div className="space-y-12">

          {perguntas.map((pergunta) => (
            <div key={pergunta.id}>

              <h2 className="text-xl font-bold mb-4">
                {pergunta.titulo}
              </h2>

              {pergunta.respostas.map((resposta) => (
                <label
                  key={resposta}
                  className="block mb-3"
                >
                  <input
                    type="radio"
                    name={pergunta.id}
                    value={resposta}
                    onChange={(e) =>
                      setRespostas({
                        ...respostas,

                        [pergunta.id]:
                          e.target.value,
                      })
                    }
                  />{" "}
                  {resposta}
                </label>
              ))}

            </div>
          ))}

          <button
            onClick={votar}
            className="w-full bg-green-600 p-4 rounded text-xl font-bold"
          >
            ENVIAR VOTO
          </button>

        </div>

      </div>

    </main>
  );
}