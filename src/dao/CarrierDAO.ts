import { QueryResult } from 'pg';
import { pool } from "../db"

 class CarrierDAO {

    async getAllCarriersList(): Promise<any[]> {
        const query = `
            SELECT * FROM programs
        `;
        try {
            const result: QueryResult = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching periods:', error);
            throw error;
        }
    }
}

export { CarrierDAO };
