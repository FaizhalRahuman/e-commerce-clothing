package com.ecommerce.closetculture;

import java.sql.Connection;
import java.sql.DriverManager;

public class TestDBConnection {

        public static void main(String[] args) {
        try {
            String url = "jdbc:mysql://nozomi.proxy.rlwy.net:56538/railway";
            String user = "root";
            String pass = "mOomWoxYDwrNJJElLCJcqnThbNSXKLsS";

            Connection conn = DriverManager.getConnection(url, user, pass);
            System.out.println("Connected successfully!");
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}
