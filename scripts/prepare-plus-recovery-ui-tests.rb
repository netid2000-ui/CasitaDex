require 'xcodeproj'
root = File.expand_path('..', __dir__)
path = 'ios/CasitaDexPlusStoreQA.xcodeproj'
abort 'Expected isolated QA project' unless File.directory?(path)
project = Xcodeproj::Project.open(path)
app = project.targets.find { |t| t.name == 'CasitaDexPlusStoreQA' }
abort 'Missing isolated app' unless app
name = 'PlusRecoveryUITests'
abort 'Target already exists' if project.targets.any? { |t| t.name == name }
test = project.new_target(:ui_test_bundle, name, :ios, '17.0')
test.add_dependency(app)
group = project.main_group.new_group(name)
test.source_build_phase.add_file_reference(group.new_file(File.join(root, 'tests/storekit/PlusRecoveryUITests.swift')))
test.resources_build_phase.add_file_reference(group.new_file(File.join(root, 'tests/storekit/CasitaDexPlus.storekit')))
test.build_configurations.each do |c|
 c.build_settings['PRODUCT_NAME'] = name
 c.build_settings['GENERATE_INFOPLIST_FILE'] = 'YES'
 c.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = 'com.designsbyfa.casitadex.plusstoreqa.recoveryuitests'
 c.build_settings['SWIFT_VERSION'] = '5.0'
 c.build_settings['TEST_TARGET_NAME'] = app.name
 c.build_settings['LD_RUNPATH_SEARCH_PATHS'] = ['$(inherited)', '@executable_path/Frameworks', '@loader_path/Frameworks']
end
project.save
scheme = Xcodeproj::XCScheme.new
scheme.add_build_target(app); scheme.add_build_target(test); scheme.add_test_target(test); scheme.set_launch_target(app)
[scheme.launch_action, scheme.test_action].each { |a| a.xml_element.add_element('StoreKitConfigurationFileReference', {'identifier' => File.join(root, 'tests/storekit/CasitaDexPlus.storekit')}) }
scheme.save_as(path, name, true)
puts 'Created separate StoreKit recovery UI runner'
