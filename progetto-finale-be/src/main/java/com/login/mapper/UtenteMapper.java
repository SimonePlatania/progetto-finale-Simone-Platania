package com.login.mapper;
import java.time.LocalDateTime;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.login.entity.Utente;

@Mapper
public interface UtenteMapper {
    
	
	// 24/12/2024 Simone MAPPER PER LA RICERCA TRAMITE USERNAME 1)
    @Results(id = "utenteResultMap", value = {
        @Result(property = "id", column = "id"),
        @Result(property = "username", column = "username"),
        @Result(property = "email", column = "email"),
        @Result(property = "password", column = "password"),
        @Result(property = "ruolo", column = "role"),
        @Result(property = "dataCreazione", column = "created_at")
    })
    @Select("SELECT * FROM users WHERE username = #{username}")
    Utente findByUsername(String username);
    
    // 24/12/2024 Simone MAPPER PER LA RICERCA TRAMITE EMAIL 2)
    @Select("SELECT * FROM users WHERE email = #{email}")
    @ResultMap("utenteResultMap")
    Utente findByEmail(String email);
    
    // 24/12/2024 Simone MAPPER PER L'INSERIMENTO DI UN UTENTE 3)
    @Insert("INSERT INTO users (username, email, password, role, created_at) " +
           "VALUES (#{username}, #{email}, #{password}, #{ruolo}, NOW())")
    void insert(Utente utente);
    
    // 24/12/2024 Simone METODO PER ANALIZZARE L'ESISTENZA DI UN UTENTE 4)
    @Select("SELECT EXISTS(SELECT 1 FROM users WHERE username = #{username})")
    boolean existsByUsername(String username);
    
    // 24/12/2024 Simone MAPPER PER LA RICERCA TRAMITE ID 5)
    @Select("SELECT * from users WHERE id = #{id}")
    @ResultMap("utenteResultMap")
    Utente findById(Long id);
    
    // 24/12/2024 Simone MAPPER PER L'AGGIORNAMENTO UTENTE 6)
    @Update("UPDATE users SET email = #{email}, username = #{username} " + "WHERE id = #{id}")
    void updateUtente(Utente utente);
    
    // 24/12/2024 Simone MAPPER PER LA RICERCA DI UN USERNAME TRAMITE ID 7)
    @Select("SELECT username FROM users WHERE id = #{id}")
    String findUsernameById(Long id);
    
    @Insert("INSERT INTO sessioni (session_id, user_id, creation_time, last_access_time) " +
            "VALUES (#{sessionId}, #{userId}, #{creationTime}, #{lastAccessTime})")
     void insertSessione(
         @Param("sessionId") String sessionId,
         @Param("userId") Long userId,
         @Param("creationTime") LocalDateTime creationTime,
         @Param("lastAccessTime") LocalDateTime lastAccessTime
     );
}