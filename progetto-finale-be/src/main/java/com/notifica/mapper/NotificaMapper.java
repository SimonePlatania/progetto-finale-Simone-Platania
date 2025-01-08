package com.notifica.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.notifica.entity.Notifica;

@Mapper
public interface NotificaMapper {
    @Insert("INSERT INTO notifiche (tipo, messaggio, asta_id, data, user_id, letta, tipo_utente) " +
            "VALUES (#{tipo}, #{messaggio}, #{astaId}, #{data}, #{userId}, #{letta}, #{tipoUtente})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Notifica notifica);

    @Select("SELECT * FROM notifiche WHERE user_id = #{userId} ORDER BY data DESC")
    List<Notifica> findByUserId(Long userId);

    @Update("UPDATE notifiche SET letta = true WHERE id = #{id}")
    void markAsRead(Long id);


    @Delete("DELETE FROM notifiche WHERE id = #{id}")
    void delete(Long id);
    
    @Update("UPDATE notifiche SET letta = true WHERE user_id = #{userId} AND letta = false")
	void markAllAsRead(@Param("userId")Long id);
}