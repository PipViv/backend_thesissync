import { QueryResult } from 'pg';
import  Period  from '../models/Period';
import { pool } from "../db"

class PeriodDAO {
    constructor() { }

    async insertPeriod(period: Period): Promise<void> {
        const query = `
            INSERT INTO periods(name, start_period, tesis_up_end, tesis_evaluation_end, end_period, created)
            VALUES($1, $2, $3, $4, $5, $6)
        `;
        console.log(period)
        const values = [
            period.name,
            period.start_period,
            period.tesis_up_end,
            period.tesis_evaluation_end,
            period.end_period,
            period.created
        ];

        try {
            await pool.query(query, values);
            console.log('Period inserted successfully');
        } catch (error) {
            console.error('Error inserting period:', error);
            throw error;
        }
    }

    async updatePeriod(period: Period): Promise<any[]> {
        const query = `
            UPDATE periods
            SET name = $1, start_period = $2, tesis_up_end = $3, tesis_evaluation_end = $4, end_period = $5, created = $6
            WHERE id = $7
        `;
        const values = [
            period.name,
            period.start_period,
            period.tesis_up_end,
            period.tesis_evaluation_end,
            period.end_period,
            period.created,
            period.id
        ];

        try {
            const sql: QueryResult = await pool.query(query, values);
            console.log('Period updated successfully');
            return sql.rows;
        } catch (error) {
            console.error('Error updating period:', error);
            throw error;
        }
    }
    async getAllPeriods(): Promise<Period[]> {
        const query = `
            SELECT * FROM periods
        `;
        try {
            const result: QueryResult<Period> = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching periods:', error);
            throw error;
        }
    }
    async getActivePeriods(): Promise<Period[]> {
        const query = `
          SELECT * FROM periods WHERE NOW() BETWEEN start_period AND end_period
        `;
        /*const query = `
          SELECT * FROM periods
        `;*/
    
        try {
          const result: QueryResult = await pool.query(query);
          const activePeriods: Period[] = result.rows;
          return activePeriods;
        } catch (error) {
          console.error('Error fetching active periods:', error);
          throw error;
        }
      }
}

export { PeriodDAO };
