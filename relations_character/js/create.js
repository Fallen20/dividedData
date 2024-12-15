import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Recuperar la URL
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('id');
    const affiliation = urlParams.get('affiliation');

    // Recuperar el documento directamente usando el ID
    const docRef = doc(db, affiliation, characterId);
    var actualCharacter = null;

    // /recuperar el personaje actual
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            actualCharacter = docSnap.data();
            document.getElementById("character").innerHTML = actualCharacter.name;
            document.getElementById("character2").innerHTML = actualCharacter.name;
        } else {
            console.error("No se encontró el documento");
        }
    }).catch((error) => {
        console.error("Error al obtener el documento:", error);
    });

    //recuperar TODOS los personajes
    const neutralDoc = collection(db, 'neutral');
    const protDoc = collection(db, 'protector');
    const rebDoc = collection(db, 'rebel');
    const allCharacters = [];

    const neutralSnapshot = await getDocs(neutralDoc);
    neutralSnapshot.forEach((doc) => {
        const data = doc.data();
        allCharacters.push({
            id: doc.id,
            name: data.name
        });
    });

    // Recuperar documentos de la colección 'protector'
    const protSnapshot = await getDocs(protDoc);
    protSnapshot.forEach((doc) => {
        const data = doc.data();
        allCharacters.push({
            id: doc.id,
            name: data.name
        });
    });

    // Recuperar documentos de la colección 'rebel'
    const rebSnapshot = await getDocs(rebDoc);
    rebSnapshot.forEach((doc) => {
        const data = doc.data();
        allCharacters.push({
            id: doc.id,
            name: data.name
        });
    });

    //recuperar las relaciones del personaje que cargamos
    const relations = [];


    const relationsCollection = collection(db, 'relations');
    try {
        // Crear una consulta para character_1
        const queryForChar1 = query(relationsCollection, where("character_1", "==", characterId));
        // Crear una consulta para character_2
        const queryForChar2 = query(relationsCollection, where("character_2", "==", characterId));

        // Ejecutar ambas consultas
        const [char1Snapshot, char2Snapshot] = await Promise.all([
            getDocs(queryForChar1),
            getDocs(queryForChar2)
        ]);

        // Combinar los resultados

        char1Snapshot.forEach((doc) => {
            relations.push({
                id: doc.id,
                ...doc.data()
            });
        });


        // Log de las relaciones encontradas
        console.log("Relaciones donde character_1 o character_2 es igual a:", characterId, relations);
    } catch (error) {
        console.error("Error al recuperar las relaciones:", error);
    }

    // Crear un set con los IDs de personajes que aparecen en las relaciones
    const characterIdsInRelations = new Set();
    relations.forEach((relation) => {
        characterIdsInRelations.add(relation.character_1);
    });

    let actualCharacter2 = { id: characterId, name: actualCharacter.name };

    // Agregar el ID del personaje actual al set para excluirlo también
    characterIdsInRelations.add(actualCharacter2.id);

    // Filtrar el array de personajes para eliminar los que están en las relaciones o son el personaje actual
    const filteredCharacters = allCharacters.filter(character => {
        return !characterIdsInRelations.has(character.id);
    });

    console.log("Personajes filtradas:", filteredCharacters);
    //ahora añadirlo al html
    const character_relation = document.getElementById("character_relation");
    filteredCharacters.forEach((character) => {
        const option = document.createElement("option");
        option.value = character.id;
        option.textContent = character.name;
        character_relation.appendChild(option);
    });


    document.getElementById('create').addEventListener('click', async function () {
        //recuperar el select
        const select = document.getElementById('character_relation');
        console.log();
        //crear objeto
        const relation = {
            character_1: characterId,
            character_2: select.value,
            relation: document.getElementById('relation').value
        };

        //meter la relacion en la coleccion 'relations'
        try {
            await addDoc(collection(db, "relations"), relation);
            console.log("Relación creada con exito");

            window.location.href = redirection(`relations_character/see_relations.html?affiliation=${affiliation}&id=${characterId}`);

        } catch (error) {
            console.error("Error al crear la relación:", error);
        }

    });
});
