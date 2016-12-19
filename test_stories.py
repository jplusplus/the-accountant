#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json

init_variables = {}
scenarios = []
prev_year = -1
step_count = 0

# Loads JSON
with open('data.json') as data_file:    
    data = json.load(data_file)

# Parses the init vars
for var in data["vars"]:
	init_variables[var] = data["vars"][var]

scenarios.append(
	{"step": step_count, 
	 "scenarios": [
	 	{"name": "init","variables": init_variables}
	 ]
	}) 

# Loops through the steps
for step in data["steps"]:
	game_over_political = 0
	game_over_police = 0
	game_over_contractors = 0
	rich = 0
	deficit = 0
	year = step["year"]
	step_count += 1

	scenarios.append({"step": step_count, "scenarios": []}) 

	# Loops through all scenarios from the previous step
	for scenario in scenarios[step_count - 1]["scenarios"]:

		prev_scenario_variables = scenario["variables"].copy()
		do_step = 1

		# Checks if there are any conditions for this step
		if "condition" in step:
			if "value_min" in step["condition"]:
				if prev_scenario_variables[step["condition"]["var"]] >= step["condition"]["value_min"]:
					do_step = 1
				else:
					do_step = 0
			elif "value_max" in step["condition"]:
				if prev_scenario_variables[step["condition"]["var"]] <= step["condition"]["value_max"]:
					do_step = 1
				else:
					do_step = 0

		if do_step == 1:
			# Loops through the choices and evolve variables
			for choice in step["choices"]:
				scenario_name = scenario["name"] + "|" + choice["text@en"]
				variables = prev_scenario_variables.copy()

				if "var_changes" in choice:
					for variable in choice["var_changes"]:
						variables[variable] = prev_scenario_variables[variable] + choice["var_changes"][variable]
				
				# End of year calculations if new year
				if (prev_year < year):
				 	variables["reserves"] = variables["reserves"] + variables["resources"] - variables["expenditures"]
				
				if variables["risk_political"] > 4:
					game_over_political += 1
				if variables["risk_contractors"] > 4:
					game_over_contractors += 1
				if variables["risk_police"] > 4:
					game_over_police += 1
				if variables["personal_account"] > 10000:
					rich += 1
				if variables["reserves"] < 0:
					deficit += 1

				scenarios[step_count]["scenarios"].append({"name": scenario_name, "variables": variables})
		else:
			scenario_name = scenario["name"]
			variables = prev_scenario_variables.copy()
			scenarios[step_count]["scenarios"].append({"name": scenario_name, "variables": variables})
	print "Step: " + str(step_count)
	print "Scenarios: " + str(len(scenarios[step_count]["scenarios"]))
	print "game_over_police: " + str(game_over_police)
	print "game_over_contractors: " + str(game_over_contractors)
	print "game_over_political: " + str(game_over_political)
	print "player has over 10k: " + str(rich)
	print "city in the red: " + str(deficit)
	prev_year = year