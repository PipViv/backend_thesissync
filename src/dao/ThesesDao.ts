import { Theses } from "../models/Theses";
import MessageDoc from "../models/MessageDoc"

import { pool } from "../db"
import { QueryResult } from "pg";

export class ThesesDao {
  constructor() { }

  async create(tesis: Theses): Promise<boolean> {
    try {
      let query = '';
      let values = [];

      if (tesis.getAutorA() === null && tesis.getAutorB() === null) {
        // Si tanto el integrante A como el B son nulos, insertar solo el autor público y el tutor
        query = `INSERT INTO documents (user_id_public, user_id_tutor, comentario, document, title, fecha_creacion, extension) VALUES ($1, $2, $3, $4, $5, $6, $7);`;
        values = [
          tesis.getAutor(),
          tesis.getTutor(),
          tesis.getComentario(),
          tesis.getDocumento(),
          tesis.getTitulo(),
          tesis.getFechaEntrega(),
          tesis.getExtension()
        ];
      } else {
        // Si alguno de los integrantes A o B no es nulo, insertar también los IDs de los integrantes
        query = `INSERT INTO documents (user_id_public, user_id_a, user_id_b, user_id_tutor, comentario, document, title, fecha_creacion, extension) VALUES ($1, (SELECT id FROM users WHERE cedula = $2), (SELECT id FROM users WHERE cedula = $3), (SELECT id FROM users WHERE cedula = $4), $5, $6, $7, $8, $9);`;
        values = [
          tesis.getAutor(),
          tesis.getAutorA(),
          tesis.getAutorB(),
          tesis.getTutor(),
          tesis.getComentario(),
          tesis.getDocumento(),
          tesis.getTitulo(),
          tesis.getFechaEntrega(),
          tesis.getExtension()
        ];
      }

      await pool.query(query, values);

      return true;
    } catch (error) {
      console.error("Error al crear la tesis:", error);
      return false;
    }
  }




  /*
  async create(tesis: Theses): Promise<boolean> {
    try {
      const query = `INSERT INTO documents (user_id_public, user_id_a, user_id_b, user_id_tutor, comentario, document, title, fecha_creacion, extension) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`;
      const values = [
        tesis.getAutor(),
        tesis.getAutorA(),
        tesis.getAutorB(),
        tesis.getTutor(),
        tesis.getComentario(),
        tesis.getDocumento(),
        tesis.getTitulo(),
        tesis.getFechaEntrega(),
        tesis.getExtension()
      ];

      await pool.query(query, values);
      //console.log(query, values)
      // Si la inserción fue exitosa, retornar true
      return true;
    } catch (error) {
      // Si ocurrió un error durante la inserción, registrar el error y retornar false
      console.error("Error al crear la tesis:", error);
      return false;
    }
  }*/
    async searchDocById(id: number): Promise<any[]> {
      try {
        const query = `SELECT 
                        d.document_id AS document_id, 
                        d.user_id_public, 
                        u_public.nombre AS public_nombre,
                        u_public.apellido AS public_apellido,
                        
                        d.user_id_a, 
                        u_a.nombre AS a_nombre,
                        u_a.apellido AS a_apellido,
                        
                        d.user_id_b, 
                        u_b.nombre AS b_nombre,
                        u_b.apellido AS b_apellido,
                        
                        d.user_id_tutor, 
                        u_tutor.nombre AS tutor_nombre,
                        u_tutor.apellido AS tutor_apellido,
                        
                        d.comentario, 
                        d.title, 
                        d.fecha_creacion, 
                        d.document, 
                        d.extension, 

                        COALESCE(c.final_score, 0) AS calificacion, -- Si es NULL, lo pone en 0

                        j.jurado, 
                        u_jurado.nombre AS jurado_nombre,
                        u_jurado.apellido AS jurado_apellido

                    FROM 
                        documents d
                    LEFT JOIN 
                        evaluations c ON d.document_id = c.thesis_id 
                    LEFT JOIN 
                        jurado_documents j ON d.document_id = j.tesis

                    -- Uniones con la tabla de usuarios
                    LEFT JOIN users u_public ON d.user_id_public = u_public.id
                    LEFT JOIN users u_a ON d.user_id_a = u_a.id
                    LEFT JOIN users u_b ON d.user_id_b = u_b.id
                    LEFT JOIN users u_tutor ON d.user_id_tutor = u_tutor.id
                    LEFT JOIN users u_jurado ON j.jurado = u_jurado.id

                    WHERE 
                        d.user_id_public = $1
                        OR d.user_id_a = $1
                        OR d.user_id_b = $1
                        OR j.jurado = $1
                    `; // Pega la consulta de arriba aquí
    
        const values = [id];
        const result: QueryResult = await pool.query(query, values);
    
        console.log(result.rows);
    
        // Formatear los resultados antes de devolverlos
        const formattedResults = result.rows.map(row => ({
          document_id: row.document_id,
          user_id_public: row.user_id_public,
          public_nombre: row.public_nombre +" "+row.public_apellido,
    
          user_id_a: row.user_id_a,
          a_nombre: row.a_nombre+" "+row.a_apellido,
    
          user_id_b: row.user_id_b,
          b_nombre: row.b_nombre +" "+row.b_apellido,
          
    
          user_id_tutor: row.user_id_tutor,
          tutor_nombre: row.tutor_nombre +" "+ row.tutor_apellido,
    
          comentario: row.comentario,
          title: row.title,
          fecha_creacion: new Date(row.fecha_creacion).toISOString(),
          document: row.document,
          extension: row.extension.trim(),
          calificacion: row.calificacion,
    
          user_id_jurado: row.jurado || null,
          jurado_nombre: row.jurado_nombre +" "+row.jurado_apellido || "",
        }));
    
        return formattedResults;
      } catch (error) {
        console.error('Error searching document by ID:', error);
        throw new Error('Error searching document by ID');
      }
    }
    
    // async searchDocById(id: number): Promise<any[]> {
    //   try {
    //     const query = `
    //       SELECT 
    //           d.document_id AS document_id, 
    //           d.user_id_public, 
    //           d.user_id_a, 
    //           d.user_id_b, 
    //           d.user_id_tutor, 
    //           d.comentario, 
    //           d.title, 
    //           d.fecha_creacion, 
    //           d.document, 
    //           d.extension, 
    //           COALESCE(c.final_score, 0) AS calificacion, -- Si es NULL, lo pone en 0
    //           j.jurado
    //       FROM 
    //           documents d
    //       LEFT JOIN 
    //           evaluations c ON d.document_id = c.thesis_id -- Asegúrate de que el join es correcto
    //       LEFT JOIN 
    //           jurado_documents j ON d.document_id = j.tesis
    //       WHERE 
    //           d.user_id_public = $1
    //           OR d.user_id_a = $1
    //           OR d.user_id_b = $1
    //           OR j.jurado = $1
    //     `;
    
    //     const values = [id];
    //     const result: QueryResult = await pool.query(query, values);
    
    //     console.log(result.rows);
    
    //     // Formatear los resultados antes de devolverlos
    //     const formattedResults = result.rows.map(row => ({
    //       document_id: row.document_id,
    //       user_id_public: row.user_id_public,
    //       user_id_a: row.user_id_a,
    //       user_id_b: row.user_id_b,
    //       user_id_tutor: row.user_id_tutor,
    //       comentario: row.comentario,
    //       title: row.title,
    //       fecha_creacion: new Date(row.fecha_creacion).toISOString(),
    //       document: row.document,
    //       extension: row.extension.trim(),
    //       calificacion: row.calificacion, // Ahora siempre tendrá un valor numérico
    //       user_id_jurado: row.jurado || null
    //     }));
    
    //     return formattedResults;
    
    //   } catch (error) {
    //     console.error('Error searching document by ID:', error);
    //     throw new Error('Error searching document by ID');
    //   }
    // }
    
//   async searchDocById(id: number): Promise<any[]> {
//     try {
//       // Consulta para obtener el documento y sus detalles, la calificación y el jurado
//       const query = `
//   SELECT 
//       d.document_id AS document_id, 
//       d.user_id_public, 
//       d.user_id_a, 
//       d.user_id_b, 
//       d.user_id_tutor, 
//       d.comentario, 
//       d.title, 
//       d.fecha_creacion, 
//       d.document, 
//       d.extension, 
//       d.calificacion, 
//       j.jurado
//   FROM 
//       documents d
//   LEFT JOIN 
//       calificacion c ON d.document_id = c.thesis_id
//   LEFT JOIN 
//       jurado_documents j ON d.document_id = j.tesis
//   WHERE 
//       d.user_id_public = $1
//       OR d.user_id_a = $1
//       OR d.user_id_b = $1
//       OR j.jurado = $1
// `;
//       const values = [id];
//       const result: QueryResult = await pool.query(query, values);
//       console.log(result.rows);
//       // Formatear los resultados antes de devolverlos
//       const formattedResults = result.rows.map(row => {
//         return {
//           document_id: row.document_id,
//           user_id_public: row.user_id_public,
//           user_id_a: row.user_id_a,
//           user_id_b: row.user_id_b,
//           user_id_tutor: row.user_id_tutor,
//           comentario: row.comentario,
//           title: row.title,
//           fecha_creacion: new Date(row.fecha_creacion).toISOString(),
//           document: row.document,
//           extension: row.extension.trim(),
//           calificacion: row.calificacion, // Si la calificación es nula, establecerla en 0
//           user_id_jurado: row.jurado || null // Usar 'jurado' en lugar de 'jurado_id', y establecerlo como nulo si es nulo
//         };
//       });

//       return formattedResults;

//     } catch (error) {
//       console.error('Error searching document by ID:', error);
//       throw new Error('Error searching document by ID');
//     }
//   }


  async descargarTesisPorId(id: number) {
    try {
      const result = await pool.query('SELECT document, title, extension FROM documents WHERE document_id = $1', [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error al descargar la tesis:', error);
      throw error;
    }
  }


  // async saveMessageForDoc(message: MessageDoc) {
  //   try {
  //     console.log("entra", message)
  //     const sql = 'INSERT INTO chats (autor, message, doc, send) VALUES ($1,$2,$3, CURRENT_TIMESTAMP);'
  //     const values = [message.getAutor(), message.getMessage(), message.getDocument()]
  //     const result: QueryResult = await pool.query(sql, values);
  //     console.log(result)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  async saveMessageForDoc(message: MessageDoc, send:string) {
    try {
        console.log("entra", message, send);
        const sql = 'INSERT INTO chats (autor, message, doc, send) VALUES ($1, $2, $3, $4) RETURNING *;';
        const values = [message.getAutor(), message.getMessage(), message.getDocument(), send];
        const result: QueryResult = await pool.query(sql, values);
        
        console.log(result.rows[0]); // Para ver el mensaje insertado
        return result.rows[0]; // Retorna el mensaje insertado
    } catch (error) {
        console.error(error);
        throw error; // Relanzar el error para manejarlo adecuadamente
    }
}


  // async showChatByDocId(id: number): Promise<any[]> {
  //   try {
  //     const query = "SELECT id, message, autor, doc, TO_CHAR(send, 'DD/MM/YYYY HH12:MI AM') AS fecha_envio FROM chats WHERE doc = $1;";
  //     const values = [id];
  //     const result: QueryResult = await pool.query(query, values);
  //     if (result.rows.length === 0) {
  //       return []; // Indicar que no hay mensajes
  //     }
  //     return result.rows; // Devolver los mensajes si los hay
  //   } catch (error) {
  //     console.error('Error al descargar la tesis:', error);
  //     throw error;
  //   }
  // }

  async showChatByDocId(id: number): Promise<any[]> {
    try {
        const query = `
            SELECT 
                c.id, 
                c.message, 
                c.autor, 
                c.doc, 
                u.nombre || ' ' || u.apellido AS autor_nombre, 
                TO_CHAR(send AT TIME ZONE 'UTC' AT TIME ZONE 'America/Bogota', 'DD/MM/YYYY HH24:MI') AS fecha_envio
            FROM chats c
            LEFT JOIN users u ON c.autor = u.id
            WHERE c.doc = $1;
        `;
        const values = [id];
        const result: QueryResult = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return []; // Indicar que no hay mensajes
        }
        
        return result.rows; // Devolver los mensajes con el autor_nombre
    } catch (error) {
        console.error('Error al obtener los mensajes del chat:', error);
        throw error;
    }
}


  async asignarJuradoTesis(jurado: number, tesis: number): Promise<void> {
    try {
      console.log(tesis, jurado)
      const query = "INSERT INTO jurado_documents (jurado, tesis) VALUES($1,$2);";
      const values = [tesis, jurado];
      const result: QueryResult = await pool.query(query, values);
      console.log(result.rows)
    } catch (error) {
      console.error('Error al descargar la tesis:', error);
      throw error;
    }
  }

  // async evaluartesis(investigacion: number, ortografia: number, bibliografia: number, final: number, thesisId: number): Promise<any> {
  //   try {
  //     const query = "INSERT INTO Evaluaciones (thesis_id, investigacion, ortografia, bibliografia, final) VALUES ($1, $2, $3, $4, $5);"
  //     const values = [
  //       thesisId,
  //       investigacion,
  //       ortografia,
  //       bibliografia,
  //       final
  //     ]
  //     const result: QueryResult = await pool.query(query, values);
  //     const updateQuery = "UPDATE documents SET calificacion = $1 WHERE id = $2;";
  //     const updateValues = [final, thesisId];
  //     const result2: QueryResult = await pool.query(updateQuery, updateValues);

  //     console.log(result2.rows)
  //     return result.rows;
  //   } catch (error) {
  //     console.error('Error al la evaluacion de la tesis:', error);
  //     throw error;
  //   }
  // }
  // async evaluarTesis(thesisId: number, criteria: { aspect: string; weight: number; score: number; observations: string }[]) {
  //   const client = await pool.connect();
  //   try {
  //     await client.query('BEGIN'); // Inicia la transacción

  //     // Insertar evaluación general en 'evaluations'
  //     const evaluationRes = await client.query(
  //       `INSERT INTO evaluations (thesis_id, evaluator_name, evaluator_email, final_score) 
  //        VALUES ($1, 'Evaluador Anónimo', 'anonimo@example.com', $2) RETURNING id`,
  //       [thesisId, criteria.reduce((sum, c) => sum + c.score * c.weight, 0)] // Suma ponderada
  //     );

  //     const evaluationId = evaluationRes.rows[0].id;

  //     // Insertar detalles en 'evaluation_details'
  //     for (const criterion of criteria) {
  //       await client.query(
  //         `INSERT INTO evaluation_details (evaluation_id, aspect, weight, score, weighted_score, observations) 
  //          VALUES ($1, $2, $3, $4, $5, $6)`,
  //         [evaluationId, criterion.aspect, criterion.weight, criterion.score, criterion.score * criterion.weight, criterion.observations]
  //       );
  //     }

  //     await client.query('COMMIT'); // Confirmar la transacción
  //   } catch (error) {
  //     await client.query('ROLLBACK'); // Revertir cambios en caso de error
  //     console.error('Error al guardar evaluación:', error);
  //     throw new Error('Error al guardar la evaluación en la base de datos');
  //   } finally {
  //     client.release(); // Liberar la conexión
  //   }
  // }

    // async evaluarTesis(thesisId: number, evaluator: string, email: string, finalScore: number, criteria: { aspect: string; weight: number; score: number; weightedScore: number; observations: string }[]) {
    //   const client = await pool.connect();
    //   try {
    //     await client.query('BEGIN'); // Iniciar transacción
  
    //     // Insertar evaluación general en 'evaluations'
    //     const evaluationRes = await client.query(
    //       `INSERT INTO evaluations (thesis_id, evaluator_name, evaluator_email, final_score) 
    //        VALUES ($1, $2, $3, $4) RETURNING id`,
    //       [thesisId, evaluator, email, finalScore]
    //     );
  
    //     const evaluationId = evaluationRes.rows[0].id;
  
    //     // Insertar cada aspecto en 'evaluation_details'
    //     for (const criterion of criteria) {
    //       await client.query(
    //         `INSERT INTO evaluation_details (evaluation_id, aspect, weight, score, weighted_score, observations) 
    //          VALUES ($1, $2, $3, $4, $5, $6)`,
    //         [evaluationId, criterion.aspect, criterion.weight, criterion.score, criterion.weightedScore, criterion.observations]
    //       );
    //     }
  
    //     await client.query('COMMIT'); // Confirmar la transacción
    //   } catch (error) {
    //     await client.query('ROLLBACK'); // Revertir cambios en caso de error
    //     console.error('Error al guardar evaluación:', error);
    //     throw new Error('Error al guardar la evaluación en la base de datos');
    //   } finally {
    //     client.release(); // Liberar conexión
    //   }
    // }
    async guardarEvaluacion(thesisId: number, evaluatorName: string, evaluatorEmail: string, finalScore: number) {
      try {
        const query = `
          INSERT INTO evaluations (thesis_id, evaluator_name, evaluator_email, final_score, created_at)
          VALUES ($1, $2, $3, $4, NOW()) RETURNING id;
        `;
        const values = [thesisId, evaluatorName, evaluatorEmail, finalScore];
        const result = await pool.query(query, values);
        return result.rows[0].id; // Devuelve el ID de la evaluación insertada
      } catch (error) {
        console.error('Error al guardar evaluación:', error);
        throw error;
      }
    }
  
    async guardarDetalleEvaluacion(evaluationId: number, aspect: string, weight: number, score: number, weightedScore: number, observations: string) {
      try {
        const query = `
          INSERT INTO evaluation_details (evaluation_id, aspect, weight, score, weighted_score, observations)
          VALUES ($1, $2, $3, $4, $5, $6);
        `;
        const values = [evaluationId, aspect, weight, score, weightedScore, observations];
        await pool.query(query, values);
      } catch (error) {
        console.error('Error al guardar detalle de evaluación:', error);
        throw error;
      }
    }

  // async searchEvaluacion(thesisId: number): Promise<any> {
  //   try {
  //     const query = "SELECT * FROM evaluations WHERE thesis_id = $1;"
  //     const values = [
  //       thesisId
  //     ]
  //     const result: QueryResult = await pool.query(query, values);
  //     return result.rows;
  //   } catch (error) {
  //     console.error('Error al la evaluacion de la tesis:', error);
  //     throw error;
  //   }
  // }
  async searchEvaluacion(thesisId: number): Promise<any> {
    try {
        const query = `
            SELECT 
                e.id, 
                e.thesis_id, 
                e.evaluator_name, 
                e.evaluator_email, 
                e.final_score, 
                TO_CHAR(e.created_at, 'DD/MM/YYYY HH12:MI AM') AS fecha_evaluacion,
                COALESCE(json_agg(json_build_object(
                    'id', d.id,
                    'aspect', d.aspect,
                    'weight', d.weight,
                    'score', d.score,
                    'weighted_score', d.weighted_score,
                    'observations', d.observations
                )) FILTER (WHERE d.id IS NOT NULL), '[]') AS detalles
            FROM evaluations e
            LEFT JOIN evaluation_details d ON e.id = d.evaluation_id
            WHERE e.thesis_id = $1
            GROUP BY e.id;
        `;
        const values = [thesisId];
        const result: QueryResult = await pool.query(query, values);

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error al obtener la evaluación:', error);
        throw error;
    }
}

  /*
  async showChatByDocId(id: number):Promise<any[]>{
    try {
      //const query = `SELECT * FROM chats WHERE doc = $1`;
      const query = "SELECT id, message, autor, doc, TO_CHAR(send, 'DD/MM/YYYY HH12:MI AM') AS fecha_envio FROM chats WHERE doc = $1;";
      const values = [id];
      const result: QueryResult = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error al descargar la tesis:', error);
      throw error;
    }
  }*/



  async insertTheses(theses: Theses): Promise<string> {
    try {
      const query = `INSERT INTO tesis (user_id_o, user_id_a, user_id_b, user_id_tutor, comentario, documento, title, fecha_creacion) VALUES($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`;
      const values = [theses.getAutor(), theses.getAutorA(), theses.getAutorB(), theses.getTutor(), theses.getComentario(), theses.getDocumento(), theses.getTitulo()]
      const result = await pool.query(query, values);
      if (result.rowCount == 1) {
        console.log('Datos guardado con exito');
        return "succes"
      } else {
        console.error('Error al guardar la informacion.');
        return "error";
      }
    } catch (error) {
      console.error('Error al guardar el documento en la base de datos:', error);
      return "error";
    }

  }

  async viewAllTheses() {
    try {
      const result = await pool.query('SELECT * FROM tesis');
      return result.rows;
    } catch (error) {
      console.error('Error al obtener tesis:', error);
      throw error;
    }
  }
  async descargarTesisPorId2(thesisId: number) {
    try {
      const result = await pool.query('SELECT documento FROM tesis WHERE id = $1', [thesisId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error al descargar la tesis:', error);
      throw error;
    }
  }
  async viewAllThesesWhereAdmin(id: number) {
    try {
      const result = await pool.query('SELECT * FROM tesis WHERE user_id_jury = $1', [id]);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener tesis:', error);
      throw error;
    }
  }

  async viewAllThesesWhereEstu(id: number) {
    try {
      //const result = await pool.query('SELECT * FROM tesis WHERE user_id_o = $1', [id]);
      const result = await pool.query(`SELECT t.*, 
        u.cedula AS codigo_o, u.nombre AS nombre_o, u.apellido AS apellido_o,
        ua.cedula AS codigo_a, ua.nombre AS nombre_a, ua.apellido AS apellido_a,
        ub.cedula AS codigo_b, ub.nombre AS nombre_b, ub.apellido AS apellido_b
 FROM tesis t
 JOIN usuarios u ON t.user_id_o = u.id
 JOIN usuarios ua ON t.user_id_a = ua.id
 JOIN usuarios ub ON t.user_id_b = ub.id
 WHERE u.id = $1;
 `, [id])
      return result.rows;
    } catch (error) {
      console.error('Error al obtener tesis:', error);
      throw error;
    }
  }

}