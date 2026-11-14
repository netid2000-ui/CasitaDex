require 'xcodeproj'
require 'fileutils'
root = File.expand_path('..', __dir__)
path = 'ios/CasitaDexPlusStoreQA.xcodeproj'
abort 'Expected isolated Plus QA project' unless File.directory?(path)
project = Xcodeproj::Project.open(path)
app = project.targets.find { |t| t.name == 'CasitaDexPlusStoreQA' }
abort 'Missing QA app target' unless app
name = 'PlusStoreSessionTests'
abort 'Test target already exists; use existing target' if project.targets.any? { |t| t.name == name }
test = project.new_target(:unit_test_bundle, name, :ios, '17.0')
test.add_dependency(app)
group = project.main_group.new_group(name)
['tests/storekit/PlusStoreSessionTests.swift', 'modules/casitadex-plus-store/ios/PlusStoreReader.swift', 'modules/casitadex-plus-store/ios/PlusTransactionPolicy.swift'].each do |f|
 test.source_build_phase.add_file_reference(group.new_file(File.join(root, f)))
end
test.resources_build_phase.add_file_reference(group.new_file(File.join(root, 'tests/storekit/CasitaDexPlus.storekit')))
test.build_configurations.each do |c|
 c.build_settings['PRODUCT_NAME'] = name
 c.build_settings['GENERATE_INFOPLIST_FILE'] = 'YES'
 c.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = 'com.designsbyfa.casitadex.plusstoreqa.tests'
 c.build_settings['SWIFT_VERSION'] = '5.0'
 c.build_settings['SWIFT_ACTIVE_COMPILATION_CONDITIONS'] = 'DEBUG'
 c.build_settings['TEST_HOST'] = '$(BUILT_PRODUCTS_DIR)/CasitaDexPlusStoreQA.app/$(BUNDLE_EXECUTABLE_FOLDER_PATH)/CasitaDexPlusStoreQA'
 c.build_settings['BUNDLE_LOADER'] = '$(TEST_HOST)'
 c.build_settings['LD_RUNPATH_SEARCH_PATHS'] = ['$(inherited)', '@executable_path/Frameworks', '@loader_path/Frameworks']
end
project.save
scheme = Xcodeproj::XCScheme.new
scheme.add_build_target(app)
scheme.add_build_target(test)
scheme.add_test_target(test)
scheme.set_launch_target(app)
scheme.launch_action.xml_element.add_element('StoreKitConfigurationFileReference', {'identifier' => File.join(root, 'tests/storekit/CasitaDexPlus.storekit')})
scheme.test_action.xml_element.add_element('StoreKitConfigurationFileReference', {'identifier' => File.join(root, 'tests/storekit/CasitaDexPlus.storekit')})
scheme.save_as(path, name, true)
puts 'Created serial hosted StoreKit test target'
