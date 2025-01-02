package com.login.mapper;

import org.apache.ibatis.annotations.*;
import java.time.LocalDateTime;
import com.login.entity.Utente;

@Mapper
public interface SessioneMapper {
    
    @Insert("INSERT INTO sessioni (session_id, user_id, creation_time, last_access_time) " +
            "VALUES (#{sessionId}, #{userId}, #{creationTime}, #{lastAccessTime})")
    void insertSessione(@Param("sessionId") String sessionId, 
                       @Param("userId") Long userId, 
                       @Param("creationTime") LocalDateTime creationTime, 
                       @Param("lastAccessTime") LocalDateTime lastAccessTime);

    @Select("SELECT u.* FROM users u " +
            "JOIN sessioni s ON u.id = s.user_id " +
            "WHERE s.session_id = #{sessionId} " +
            "AND s.last_access_time > DATE_SUB(NOW(), INTERVAL 30 MINUTE)")
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "username", column = "username"),
        @Result(property = "email", column = "email"),
        @Result(property = "password", column = "password"),
        @Result(property = "ruolo", column = "role"),
        @Result(property = "dataCreazione", column = "created_at")
    })
    Utente findUtenteByValidSessionId(String sessionId);

    @Update("UPDATE sessioni SET last_access_time = NOW() " +
            "WHERE session_id = #{sessionId}")
    void updateLastAccessTime(String sessionId);

    @Delete("DELETE FROM sessioni WHERE session_id = #{sessionId}")
    void deleteSessione(String sessionId);

    @Delete("DELETE FROM sessioni " +
            "WHERE last_access_time < DATE_SUB(NOW(), INTERVAL 30 MINUTE)")
    void deleteExpiredSessions();
}