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
  "Mônica Felipe",
  "Liane",
  "Liane casa",
  "Isabela",
  "Paulinho",
  "Solange",
  "Solange casa",
  "Luíz",
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
  "Daniela",
  "Tininha",
  "Regina",
  "Regina casa",
  "João",
  "Monica",
  "Claudia",
  "Xande",
  "Xande casa",
  "Ana",
  "Duda",
  "André",
  "André casa",
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
  "Álvaro",
  "Álvaro casa",
  "Jane",
  "Ângela",
  "Mauro",
];

const admin = "ADMIN123";

export default function Home() {
  const [nome, setNome] = useState("");
  const [logado, setLogado] = useState(false);
  const [adminLogado, setAdminLogado] = useState(false);
  const [votou, setVotou] = useState(false);

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");

  const [resultados, setResultados] = useState<any[]>([]);

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

    const q = query(collection(db, "votos"), where("nome", "==", nome));

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      setVotou(true);
    }

    setLogado(true);
  }

  async function votar() {
    if (!p1 || !p2 || !p3) {
      alert("Responda todas as perguntas");
      return;
    }

    const peso = nome.toLowerCase().includes("casa") ? 2.9 : 1;

    await addDoc(collection(db, "votos"), {
      nome,
      peso,
      pergunta1: p1,
      pergunta2: p2,
      pergunta3: p3,
      criadoEm: new Date(),
    });

    setVotou(true);

    alert("Voto enviado com sucesso");
  }

  async function carregarResultados() {
    const snapshot = await getDocs(collection(db, "votos"));

    const lista = snapshot.docs.map((doc) => doc.data());

    setResultados(lista);
  }

  function calcular(pergunta: string) {
    const total: any = {};

    resultados.forEach((v) => {
      const resposta = v[pergunta];

      if (!total[resposta]) {
        total[resposta] = 0;
      }

      total[resposta] += Number(v.peso);
    });

    return total;
  }

  if (adminLogado) {
    const r1 = calcular("pergunta1");
    const r2 = calcular("pergunta2");
    const r3 = calcular("pergunta3");

    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-bold mb-8">
          Resultados da Votação
        </h1>

        <div className="space-y-10">

          <div>
            <h2 className="text-2xl font-bold mb-4">
              1 - Idade para iniciar contribuição
            </h2>

            {Object.entries(r1).map(([k, v]) => (
              <p key={k}>
                {k}: {String(v)}
              </p>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              2 - Isenção
            </h2>

            {Object.entries(r2).map(([k, v]) => (
              <p key={k}>
                {k}: {String(v)}
              </p>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              3 - Divisão da receita
            </h2>

            {Object.entries(r3).map(([k, v]) => (
              <p key={k}>
                {k}: {String(v)}
              </p>
            ))}
          </div>

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
            onChange={(e) => setNome(e.target.value)}
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

      <div className="max-w-3xl mx-auto bg-zinc-900 p-8 rounded-2xl">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Votação Familiar
        </h1>

        <div className="space-y-10">

          <div>
            <h2 className="text-xl font-bold mb-4">
              1 - Qual a idade para iniciar a contribuição?
            </h2>

            {["24", "26", "28", "30", "32"].map((x) => (
              <label className="block mb-2" key={x}>
                <input
                  type="radio"
                  name="p1"
                  value={x}
                  onChange={(e) => setP1(e.target.value)}
                />{" "}
                {x}
              </label>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">
              2 - Teremos algum tipo de isenção?
            </h2>

            {[
              "SEM ISENÇÃO",
              "ISENÇÃO TOTAL - mora fora do RJ",
              "ISENÇÃO PARCIAL - 10%",
              "ISENÇÃO PARCIAL - 20% Brasil e 10% exterior",
            ].map((x) => (
              <label className="block mb-2" key={x}>
                <input
                  type="radio"
                  name="p2"
                  value={x}
                  onChange={(e) => setP2(e.target.value)}
                />{" "}
                {x}
              </label>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">
              3 - Divisão da receita
            </h2>

            {[
              "100% casas",
              "70% casas e 30% pessoas",
              "50% casas e 50% pessoas",
              "30% casas e 70% pessoas",
              "100% pessoas",
            ].map((x) => (
              <label className="block mb-2" key={x}>
                <input
                  type="radio"
                  name="p3"
                  value={x}
                  onChange={(e) => setP3(e.target.value)}
                />{" "}
                {x}
              </label>
            ))}
          </div>

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