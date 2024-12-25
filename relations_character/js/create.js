import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";
import { redirection } from '../../redirect.js';
import { recoverProfileFromCharacterId } from '../../common.js';


document.addEventListener("DOMContentLoaded", async () => {
    // Recuperar la URL
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('id');
    const affiliation = urlParams.get('affiliation');

    // Recuperar el documento directamente usando el ID
    const docRef = doc(db, affiliation, characterId);
    var actualCharacter = null;

    // /recuperar el personaje actual
    getDoc(docRef).then(async (docSnap) => {
        if (docSnap.exists()) {
            actualCharacter = docSnap.data();
            document.getElementById("character").innerHTML = actualCharacter.name;

            const first = await recoverProfileFromCharacterId(docSnap.id);
            document.getElementById('character_image').src = first.base64;

            document.getElementById("character2").innerHTML = actualCharacter.name;

            await recover2(characterId, actualCharacter);

        } else {
            console.error("No se encontró el documento");
        }
    }).catch((error) => {
        console.error("Error al obtener el documento:", error);
    });




    document.getElementById('create').addEventListener('click', async function () {
        //recuperar el select
        const select = document.getElementById('character_relation');

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


async function recover2(characterId, actualCharacter) {

    const allCharacters = await allCharactersFactions();
    const relations = await relaciones(characterId);

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

    //ahora añadirlo al html
    const character_relation = document.getElementById("character_relation");

    document.getElementById('character_image2').src = filteredCharacters[0].base64;

    filteredCharacters.forEach(async (character) => {
        const option = document.createElement("option");
        option.value = character.id;
        option.textContent = character.name;
        character_relation.appendChild(option);

    });

    // Luego, agregar el evento "change" al select
    character_relation.addEventListener("change", async function () {
        // Obtener el id del personaje seleccionado
        const selectedId = character_relation.value;
        console.log('cambio', selectedId);  // Esto te muestra el id del personaje seleccionado

        // Buscar el personaje correspondiente en el array filteredCharacters
        const selectedCharacter = filteredCharacters.find(character => character.id === selectedId);

        if (selectedCharacter) {
            // Aquí puedes hacer lo que necesites con el personaje seleccionado
            document.getElementById('character_image2').src = selectedCharacter.base64;
        }

    });


}

async function allCharactersFactions() {
    // Recuperar personajes de varias colecciones
    const neutralDoc = collection(db, 'neutral');
    const protDoc = collection(db, 'protector');
    const rebDoc = collection(db, 'rebel');
    const allCharacters = [];

    // Recuperar documentos de la colección 'neutral'
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

    // Aquí utilizamos Promise.all para esperar a que todas las imágenes se obtengan
    await Promise.all(allCharacters.map(async (character) => {
        let imagenBusqueda = await recoverProfileFromCharacterId(character.id);

        if (imagenBusqueda) {  // Esto verificará si base64 tiene un valor "truthy" (no null, undefined, ni vacío)
            character.base64 = imagenBusqueda.base64;
        } else {
            character.base64 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNNLEL-qmmLeFR1nxJuepFOgPYfnwHR56vcw&s';
        }


    }));


    return allCharacters;
}


async function relaciones(characterId) {
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

        return relations;
    } catch (error) {
        console.error("Error al recuperar las relaciones:", error);
    }
}