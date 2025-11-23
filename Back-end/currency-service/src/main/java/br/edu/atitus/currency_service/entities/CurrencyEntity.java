package br.edu.atitus.currency_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Table(name = "tb_currency")
@Data
public class CurrencyEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "source_currency", nullable = false, length = 3)
	private String source;

	@Column(name = "target_currency", nullable = false, length = 3)
	private String target;

	@Column(name = "conversion_rate", nullable = false, length = 3)
	private double conversionRate;

	@Transient
	private double convertedValue;
	@Transient
	private String enviroment;
}
