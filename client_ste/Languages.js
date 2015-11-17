
function Translate( string ) {
	if( localStorage.Language ) {
		if( localStorage.Language == 'EN' ) {
			return string;
		} else {
			if( string == 'Decision' ) {
				return 'Decisione';
			} else if( string == 'Event' ) {
				return 'Evento';
			} else if( string == 'Result' ) {
				return 'Risultato';
			}
		}
	}
}

window.locale = {
	'Welcome': {
		'IT': 'Benvenuto nel software di Alberi Decisionali (versione 1.3.7).',
		'EN': 'Welcome to Decision Trees build software (version 1.3.7).'
	},
	'Welcome2': {
		'IT': 'Clicca col destro per le istruzioni.',
		'EN': 'Right click for help.'
	},
	'MenuDecision': {
		'IT': 'Decisione',
		'EN': 'Decision'
	},
	'MenuEvent': {
		'IT': 'Evento',
		'EN': 'Event'
	},
	'MenuResult': {
		'IT': 'Risultato',
		'EN': 'Result'
	},
	'MenuDeleteNode': {
		'IT': 'Cancella nodo selezionato',
		'EN': 'Delete selected node'
	},
	'MenuLoadSave': {
		'IT': 'Carica/Salva',
		'EN': 'Load/Save'
	},
	'MenuOptions': {
		'IT': 'Opzioni',
		'EN': 'Options'
	},
	'MenuHelp': {
		'IT': 'Aiuto',
		'EN': 'Help'
	},
	'LocalStorageNS': {
		'IT': 'Questo browser non supporta il Local Storage, si prega di aggiornarlo.',
		'EN': 'Local Storage feature is not supported, please upgrade your browser.'
	},
	'Delete': {
		'IT': 'Il nodo selezionato e tutti i suoi nodi verranno cancellati. Sei sicuro?',
		'EN': 'Selected Node and all its branches and subnodes will be deleted. Are you sure?'
	},
	'NoSelected': {
		'IT': 'Nessun nodo selezionato.',
		'EN': 'No selected node.'
	},
	'Created': {
		'IT': 'Creato nodo di tipo ',
		'EN': 'Created node of type '
	},
	'NoSubNodes': {
		'IT': 'I nodi Risultato non possono avere nodi figlio.',
		'EN': 'Result nodes cannot have subnodes.'
	},
	'Select': {
		'IT': 'Per favore seleziona un nodo.',
		'EN': 'Please select a node.'
	},
	'Risk': {
		'IT': 'Il valore di rischio deve essere maggiore di 0.',
		'EN': 'The risk value must be greater than 0.'
	},
	'BranchName': {
		'IT': 'Nome Ramo',
		'EN': 'Branch Name'
	},
	'ProbSum': {
		'IT': 'La somma delle probabilita\' deve essere 1.',
		'EN': 'Probabilities sum must be 1.'
	},
	'ProbValue': {
		'IT': 'Il valore di probabilita\' deve essere compreso tra 0 e 1, estremi esclusi.',
		'EN': 'Probability value must be between 0 and 1, extremes excluded.'
	},
	'BranchValue': {
		'EN': 'Branch value must be numeric.',
		'IT': 'Il valore del ramo deve essere numerico.'
	},
	'DeleteTree': {
		'IT': 'Sei sicuro di voler cancellare l\'albero ',
		'EN': 'Are you sure you want to permanently delete the tree '
	},
	'DeleteFail': {
		'IT': 'Eliminazione fallita.',
		'EN': 'Delete failure.'
	},
	'TreeName': {
		'IT': 'Per favore inserisci un nome valido per l\'albero (1-64 caratteri).',
		'EN': 'Please insert a valid name for this Tree (1-64 chars).'
	},
	'SelectFile': {
		'IT': 'Per favore seleziona un file.',
		'EN': 'Please select a file.'
	},
	'Security': {
		'IT': 'Errore di sicurezza, questo browser non consente di leggere file locali. Per risolvere il problema, eseguirlo con il flag --allow-file-access-from-files o selezionare l\'impostazione nella configurazione.',
		'EN': 'Security error, this web browser is blocking local file reading. To solve the problem, please execute it with the flag --allow-file-access-from-files or set it in the preferences.'
	},
	'Error': {
		'IT': 'Errore nel leggere il file.',
		'EN': 'Error, unable to load the file.'
	},
	'TreeSaved': {
		'IT': 'Albero salvato con successo come ',
		'EN': 'Tree successfully saved as '
	},
	'Empty': {
		'IT': 'L\'albero risulta vuoto.',
		'EN': 'Unable to save an empty tree.'
	},
	'UnknownError': {
		'IT': 'Errore di caricamento, file incompleto o errore sconosciuto.',
		'EN': 'Load failure, incomplete or unknown error.'
	},
	'Tree': {
		'IT': 'Albero ',
		'EN': 'Tree '
	},
	'SaveSuccess': {
		'IT': ' salvato con successo.',
		'EN': ' successfully loaded.'
	},
	'DecimalValues': {
		'IT': 'Numero di decimali non valido.',
		'EN': 'Decimal length not valid.'
	},
	'SensibilityAnalysis': {
		'IT': 'Analisi di sensibilita\' sul nodo selezionato',
		'EN': 'Sensibility analysis on selected node'
	},
	'TreeNameAlready': {
		'IT': 'Un albero con lo stesso nome e\' gia\' presente. Prego scegliere un nome diverso.',
		'EN': 'A tree with the same name is already present. Please choose a different name.'
	},
	
	'AnalysisSameBranch': {
		'IT': 'Non e\' possibile scegliere lo stesso ramo per entrambi i parametri.',
		'EN': 'It is not possible to choose the same branch as both first and second parameter.'
	},
	'AnalysisNotSpecified': {
		'IT': 'Almeno un valore risulta mancante.',
		'EN': 'At least one value has not been specified.'
	},
	'AnalysisNumerics': {
		'IT': 'I valori di Inizio, Fine e Incremento devono essere numerici.',
		'EN': 'Start, End and Step values must be numeric.'
	},
	'AnalysisStep': {
		'IT': 'L\'Incremento deve essere maggiore di 0.',
		'EN': 'Step must be greater than 0.'
	},
	'AnalysisStartGreater': {
		'IT': 'Il valore di Inizio non puo\' essere maggiore del valore di Fine.',
		'EN': 'Starting value cannot be greater than ending one.'
	},
	'AnalysisValue': {
		'IT': ' (Valore)',
		'EN': ' (Value)'
	},
	'AnalysisProbability': {
		'IT': ' (Probabilita\')',
		'EN': ' (Probability)'
	},
	'AnalysisSameNodeSubBranches': {
		'IT': 'Non e\' possibile scegliere Probabilita\' per entrambi i parametri in rami appartenenti allo stesso nodo Evento.',
		'EN': 'It is not possible to set both parameters as probabilities on branches belonging to the same Event node.'
	}
}
