package com.asta.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.asta.entity.Offerta;

@Mapper
public interface OffertaMapper {
	
	@Results(id = "offertaResultMap", value = {
			@Result(property = "id", column = "id"),
			@Result(property = "itemId", column = "item_id"),
			@Result(property = "astaId", column = "asta_id"),
			@Result(property = "utenteId", column = "utente_id"),
			@Result(property = "importo", column = "importo"),
			@Result(property = "dataOfferta", column = "data_offerta"),
			@Result(property = "usernameOfferente", column = "username_offerente"),

	})
	
	@Select("SELECT o.*, u.username as username_offerente " +
	        "FROM offerte o " +
	        "JOIN users u ON o.utente_id = u.id " +  // Mancava uno spazio dopo id
	        "WHERE o.asta_id = #{astaId} " +         // Mancava uno spazio dopo astaId
	        "ORDER BY o.data_offerta DESC")
	List<Offerta> findByAstaId(@Param("astaId") Long astaId);

	@Insert("INSERT INTO offerte (item_id, asta_id, utente_id, importo, data_offerta) " + // Mancava una parentesi
	        "VALUES (#{itemId}, #{astaId}, #{utenteId}, #{importo}, #{dataOfferta})")    // Mancava una parentesi
	@Options(useGeneratedKeys = true, keyProperty = "id")
	void insert(Offerta offerta);
	
	//02/01/2025 Simone AGGIUNTA LA POSSIBILITA' DI TROVARE UNA SPECIFICA OFFERTA SPECIFICA
	  @ResultMap("offertaResultMap")
	    @Select("SELECT o.*, u.username as username_offerente " +
	            "FROM offerte o " +
	            "JOIN users u ON o.utente_id = u.id " +
	            "WHERE o.id = #{id}")
	    Offerta findById(@Param("id") Long id);

	    //02/01/2025 Simone Trova l'ultima offerta per un'asta
	    @ResultMap("offertaResultMap")
	    @Select("SELECT o.*, u.username as username_offerente " +
	            "FROM offerte o " +
	            "JOIN users u ON o.utente_id = u.id " +
	            "WHERE o.asta_id = #{astaId} " +
	            "ORDER BY o.data_offerta DESC LIMIT 1")
	    Offerta findLastOffertaByAstaId(@Param("astaId") Long astaId);

	    //02/01/2025 Simone  Aggiunta la possibilità di contare il numero di offerte per un'asta (utile per statistiche)
	    @Select("SELECT COUNT(*) FROM offerte WHERE asta_id = #{astaId}")
	    int countOfferteByAstaId(@Param("astaId") Long astaId);

	    //02/01/2025 Simone Aggiunta la possibilità di trovare tutte le offerte di un utente
	    @ResultMap("offertaResultMap")
	    @Select("SELECT o.*, u.username as username_offerente " +
	            "FROM offerte o " +
	            "JOIN users u ON o.utente_id = u.id " +
	            "WHERE o.utente_id = #{utenteId} " +
	            "ORDER BY o.data_offerta DESC")
	    List<Offerta> findByUtenteId(@Param("utenteId") Long utenteId);
	
}	
