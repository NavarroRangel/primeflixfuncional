import { useEffect, useState } from "react"
import {useParams, useNavigate} from 'react-router-dom'
import api from '../../services/api'
import './filme-info.css'
import {toast} from 'react-toastify'


function Filme(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [filmes, setFilmes ] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        async function loadFilmes (){
            await api.get(`/movie/${id}`, {
                params:{
                    api_key:'30591cbe9f04a47822272ee626c86d20',
                    language: 'pt-BR',

                }
            })
            .then((response)=>{
                setFilmes(response.data);
                setLoading(false);
            })
            .catch(()=>{
                console.log('filme nao encontrado')
                navigate('/',{ replace: true })
                return;
            })
        }


        loadFilmes();


        return() =>{
            console.log('componente desmontado')
        }

    },[navigate, id])

    function salvarFilme(){
        const minhaLista = localStorage.getItem('@primeflix');

        let filmesSalvos = JSON.parse(minhaLista) || []

        const hasFilme = filmesSalvos.some((filmesSalvo)=>
            filmesSalvo.id === filmes.id)

            if(hasFilme){
                toast.warn("ESSE FILME JA ESTÁ NA SUA LISTA")
                return;
        }
        filmesSalvos.push(filmes)
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos))
        toast.success("FILME SALVO COM SUCESSO")
    }

    if(loading){
        return(
            <div className="filme-info">
                <h1>Carregando detalhes...</h1>
            </div>
        )
    }


    return(
        <div className="filme-info">
            <h1>{filmes.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filmes.backdrop_path}`} alt={filmes.title}/>
            <h3>Sinopse</h3>
            <span>{filmes.overview}</span>
            <strong>Avaliação: {filmes.vote_average} / 10</strong>

            <div className="area-buttons">
                <button onClick={salvarFilme}>Salvar</button>
                <button>
                    <a target="blank" rel="external" href={`https://youtube.com/results?search_query=${filmes.title} trailer`}>
                        Trailer
                    </a>
                </button>
            </div>

        </div>
    )
 }
 export default Filme