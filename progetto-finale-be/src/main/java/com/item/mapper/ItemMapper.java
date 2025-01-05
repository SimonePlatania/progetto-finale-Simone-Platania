package com.item.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.One;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.item.entity.Item;

@Mapper
public interface ItemMapper {

	// 27/12/2024 Simone MAPPER FINDALL 1)
	 @Results(id = "itemResultMap", value = {
		        @Result(property = "id", column = "id"),
		        @Result(property = "nome", column = "nome"),
		        @Result(property = "descrizione", column = "descrizione"),
		        @Result(property = "prezzoBase", column = "prezzo_base"),
		        @Result(property = "rilancioMinimo", column = "rilancio_minimo"),
		        @Result(property = "dataCreazione", column = "data_creazione"),
		        @Result(property = "inAsta", column = "in_asta"),
		        @Result(property = "gestoreId", column = "gestore_id"),
		        @Result(property = "gestoreUsername", column = "gestore_username")
		    })
		    @Select("SELECT i.*, u.username as gestore_username " +
		            "FROM items i " +
		            "LEFT JOIN users u ON i.gestore_id = u.id " +
		            "WHERE i.deleted = false")
		    List<Item> findAll();

	// 27/12/2024 Simone MAPPER RICERCA ID TRAMITE PARAMETRO ID 2)
	 @Select("SELECT * FROM items WHERE id = #{id} AND deleted = false")
	    @Results({
	        @Result(property = "id", column = "id"),
	        @Result(property = "nome", column = "nome"),
	        @Result(property = "descrizione", column = "descrizione"),
	        @Result(property = "prezzoBase", column = "prezzo_base"),
	        @Result(property = "rilancioMinimo", column = "rilancio_minimo"),
	        @Result(property = "dataCreazione", column = "data_creazione"),
	        @Result(property = "inAsta", column = "in_asta"),
	        @Result(property = "gestoreId", column = "gestore_id"),
	        @Result(property = "gestoreUsername", column = "gestore_username",
	                one = @One(select = "com.login.mapper.UtenteMapper.findUsernameById"))
	    })
	    Item findById(@Param("id") Long id);
	// 27/12/2024 Simone MAPPER INSERIMENTO OGGETTO NEL DATABASE 3)
	 @Insert("INSERT INTO items (nome, descrizione, prezzo_base, rilancio_minimo, " +
	            "data_creazione, in_asta, gestore_id, deleted) VALUES " +
	            "(#{nome}, #{descrizione}, #{prezzoBase}, #{rilancioMinimo}, " +
	            "#{dataCreazione}, #{inAsta}, #{gestoreId}, false)")
	    @Options(useGeneratedKeys = true, keyProperty = "id")
	    void insert(Item item);


	// 27/12/2024 Simone MAPPER AGGIORNAMENTO OGGETTO NEL DATABASE 4)
	@Update("UPDATE items SET nome = #{nome}, descrizione = #{descrizione}, "
			+ "prezzo_base = #{prezzoBase}, rilancio_minimo = #{rilancioMinimo}, "
			+ "in_asta = #{inAsta} WHERE id = #{id}")
	void update(Item item);

	// 27/12/2024 Simone RIMOZIONE OGGETTO TRAMITE IL SUO ID 5)
    @Update("UPDATE items SET deleted = true WHERE id = #{id}")
    void delete(@Param("id") Long id);
	// 27/12/2024 Simone CONTEGGIO DELLE OFFERTE 6)
    @Select("SELECT COUNT(*) FROM offerte o " +
            "JOIN items i ON o.item_id = i.id " +
            "WHERE i.id = #{itemId} AND i.deleted = false")
    int countOfferte(@Param("itemId") Long itemId);

	// 27/12/2024 Simone RICERCA OGGETTO TRAMITE L'ID DEL GESTORE 7)
    @Select("SELECT i.*, u.username as gestore_username " +
            "FROM items i " +
            "JOIN users u ON i.gestore_id = u.id " +
            "WHERE i.gestore_id = #{gestoreId} AND i.deleted = false")
    @ResultMap("itemResultMap")
    List<Item> findByGestoreId(@Param("gestoreId") Long gestoreId);
	
}